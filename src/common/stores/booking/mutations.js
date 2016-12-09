'use strict';

import * as types from './mutation-types';
import http from 'javascripts/commons/http';
import EasyStorage from 'javascripts/commons/easy-storage';
import toast from 'javascripts/widgets/toast';
import qs from 'querystringify';

var hotelOrderData = new EasyStorage('hotelOrderData', 'session');

const DEFAULT_STATE = {

  hotel: null,
  policyId: null,
  chargeDetail: null,
  payChannel: null,
  travelType: null,
  inited: false,
  checkinTime: null,
  checkoutTime: null,
  channelType: null,

  dateChanged: null,
  couponIdChanged: null,
  couponId: null,
  defaultCoupon: null, // 默认红包stack

  travelApply: {
    id: null,
    purpose: null
  },
  useFree: true,
  roomNum: 1,
  guestPhone: null,
  guests: {
    monthly: [],    // 月结
    personal: [],   // 个人付款
    freeUse: []     // 自由使用月结
  },
  invoiceRequired: false,
  invoiceData: {
    title: null,
    invoiceType: 1,
    receiver: null,
    phone: null,
    address: null,
    postCode: null,
    invPrice: null
  },
  habit: {
    text: '',
    options: []
  }
};

var saveStorage = data => hotelOrderData.save(data);

hotelOrderData.init(DEFAULT_STATE);

export const state = hotelOrderData.data;

var chargeDetailTimeout = null;

export const mutations = {
  initHotelData(state, {hotel}){
    state.hotel = hotel;
    state.inited = true;
    saveStorage(state);
  },
  initOrderData(state, {orderData}){
    state.policyId = orderData.policyId;
    state.checkinTime = orderData.checkinTime;
    state.checkoutTime = orderData.checkoutTime;
    state.channelType = orderData.channelType;
    saveStorage(state);
  },
  setChargeDetail(state, {chargeDetail}){
    state.chargeDetail = chargeDetail;
    saveStorage(state);
  },
  setGuests(state, {guests, target}){
    state.guests[target] = guests;
    saveStorage(state);
  },
  setDate(state, {checkin, checkout}){
    state.checkinTime = checkin;
    state.checkoutTime = checkout;
    saveStorage(state);
  },
  setPayChannel(state, {channelId}){
    state.payChannel = channelId;
    saveStorage(state);
  },
  setMonthlyUseFree(state, {useFree}){
    state.useFree = useFree;
    saveStorage(state);
  },
  setRoomNum(state, {roomNum}){
    state.roomNum = roomNum;
    saveStorage(state);
  },
  setGuestPhone(state, guestPhone){
    state.guestPhone = guestPhone;
    saveStorage(state);
  },
  setTravelType(state, {travelType}){
    state.travelType = travelType;
    saveStorage(state);
  },
  setTravelApply(state, {travelApply}){
    state.travelApply = travelApply;
    saveStorage(state);
  },
  setInvoiceRequired(state, {required}){
    state.invoiceRequired = required;
    saveStorage(state);
  },
  setInvoiceData(state, {invoiceData}){
    state.invoiceData = invoiceData;
    saveStorage(state);
  },
  setDateChange(state, {date}){
    state.dateChanged = date;
    saveStorage(state);
  },
  setCouponId(state, {couponId}){
    state.couponId = couponId;
    saveStorage(state);
  },
  setDefaultCoupon(state, {defaultCoupon}){
    state.defaultCoupon = defaultCoupon;
    saveStorage(state);
  },
  setCouponIdChanged(state, {couponId}){
    state.couponIdChanged = couponId;
    saveStorage(state);
  },
  cleanCouponIdChanged(state){
    state.couponIdChanged = null;
    saveStorage(state);
  },
  // 设置
  setHabit(state, {text, options}){
    state.habit = {
      text,
      options
    };
    saveStorage(state);
  }
};

export const actions = {
  [types.INIT_HOTEL_ORDER_INFO]({commit, dispatch, state}, {params}) {
    http.get({
      url: '/hdocking/booking/preorder',
      data: params
    })
    .then(
      resp => {
        var invoiceData = resp.invoiceInfo;
        commit({
          type: 'initHotelData',
          hotel: resp
        });

        commit({
          type: 'initOrderData',
          orderData: {
            policyId: params.policyId,
            checkinTime: params.checkIn,
            checkoutTime: params.checkOut,
            channelType: params.channelType
          }
        });
        // 添加默认入住人
        // if(resp.defaultGuests){
        //   commit({
        //     type: 'setGuests',
        //     target: 'personal',
        //     guests: resp.defaultGuests
        //   });
        // }
        // 默认联系电话
        if(resp.defaultPhone){
          commit('setGuestPhone', resp.defaultPhone);
        }
        // 默认红包
        if(resp.couponInfo){
          commit({
            type: 'setDefaultCoupon',
            defaultCoupon: resp.couponInfo
          });
        }

        // 默认发票信息
        if(invoiceData){
          commit({
            type: 'setInvoiceData',
            invoiceData: {
              title: invoiceData.title,
              receiver: invoiceData.receiver,
              address: invoiceData.address,
              phone: invoiceData.phone,
              postCode: invoiceData.postCode
            }
          });
        }
        if(!state.chargeDetail){
          dispatch(types.REFRESH_CHARGE_DETAIL);
        }
      }
    );
  },
  [types.REFRESH_CHARGE_DETAIL]({state, commit, dispatch}){
    clearTimeout(chargeDetailTimeout);

    chargeDetailTimeout = setTimeout(()=> {
      http.post({
        url: '/hdocking/booking/chargesDetail',
        data: {
          policyId: state.policyId,
          checkIn: state.checkinTime,
          checkOut: state.checkoutTime,
          roomNum: state.roomNum,
          couponId: state.couponId || undefined,
          travelType: state.travelType,
          // isApplyInvoice: null,
          channelType: state.channelType
        },
        json: true,
        dataType: 'json'
      })
      .then(
        resp => {
          // 初始化时有设置默认选中的红包 
          if(state.defaultCoupon){
            // 满足使用限制
            if(resp.roomPrice >= state.defaultCoupon.useQuota){
              commit({
                type: 'setCouponId',
                couponId: state.defaultCoupon.id
              });
            }
            // 清除 stack
            commit({
              type: 'setDefaultCoupon',
              defaultCoupon: null
            });
            dispatch(types.REFRESH_CHARGE_DETAIL);
            return ;
          }

          // 红包不能使用时重置红包状态
          if(resp.companyCoupon && !resp.companyCoupon.canUse && resp.roomPrice){
            if(state.couponId){
              toast.show(resp.companyCoupon.message);
            }
            commit({
              type: 'setCouponId',
              couponId: null
            });
            resp.companyCoupon = undefined;
          }

          commit({
            type: 'setChargeDetail',
            chargeDetail: resp
          });

        },

        err => {
          var errObj = err.responseJSON;
          if(errObj.code === 801){
            setTimeout(() => {
              window.location.replace('/hotel/single/' + state.hotel.hotelId + '/main.html' + qs.stringify({
                startDate: state.checkinTime,
                endDate: state.checkoutTime
              }, true));
            }, 1500);
          }
        }
      );
    }, 50);
  },
  [types.SPLIT_GUESTS]({state, commit}){
    var limit = state.roomNum * 2,
      guests = state.guests;
    commit({
      type: 'setGuests',
      target: 'personal',
      guests: guests.personal.slice(0, limit)
    });
    commit({
      type: 'setGuests',
      target: 'monthly',
      guests: guests.monthly.slice(0, limit)
    });
    commit({
      type: 'setGuests',
      target: 'freeUse',
      guests: guests.freeUse.slice(0, limit)
    });
  }
};

export default {
    state,
    mutations,
    actions
};