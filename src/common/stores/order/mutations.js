'use strict';

// import moment from 'moment';
import * as types from './mutation-types';
import http from 'javascripts/commons/http';

export const state = {
  //机票详情
  flight: {
    voyageResp: {
      depttime: '',
      arrtime: ''
    },
    ticketsResp: []
  },

  //机票确认页往返数据
  flights: {
    inited: false,
    go: {
      voyageResp: {
        depttime: '',
        arrtime: ''
      },
      ticketsResp: []
    },
    back: {
      voyageResp: {
        depttime: '',
        arrtime: ''
      },
      ticketsResp: []
    }
  },

  //退改签规则
  refundRules: {},

  //发票信息
  invoiceInfo: {},

  //酒店下单数据缓存
  hotel: {
    roomInfo: {}
  },

  //个人偏好
  habit: {
    text: '',
    options: []
  },

  //订单管理
  orders: {
    resultList: []
  },

  //保险列表
  insurance: {},

  //出差信息
  btripinfo: {},

  //退票理由
  refundReasons: {},
  //酒店订单详情
  orderHotelDetail:{},
  //酒店订单消费详情
  orderHotelCostDetail:{},
    //酒店订单补寄发票预填信息
  orderHotelInvoice : {},
    monthlyApplyStatus:{}
};

export const mutations = {
  initFlightData(state) {
    state.flights.inited = true;
  }
};

export const actions = {

  [types.INIT_FLIGHT_DETAIL_ASYNC]({ state }, id) {
    if (id) {
      http.get({
        url: '/bflight/h5order/detail',
        data: {
          orderId: id
        },
        mask: false
      }).done((res) => {
        state.flight = res;
      });
    }
  },

  [types.INIT_FLIGHTS_DETAIL_ASYNC]({ state, commit }, ids) {
    if (ids) {
      http.get({
        url: '/bflight/h5order/ordersDetail',
        data: {
          orderIds: ids.join(',')
        }
      }).done((res) => {
        state.flights.go = res[0];
        if (res.length > 1) {
          state.flights.back = res[1];
        }
        commit('initFlightData');
      });
    }
  },

  [types.INIT_REFUND_RULES_ASYNC]({ state }, params) {
    http.get({
      url: '/bflight/flight/queryChangeRule',
      data: params
    }).done((data) => {
      if (data) {
        state.refundRules = data;
      }
    });
  },

  [types.INIT_INVOICE_ASYNC]({ state }, params) {
    http.get({
      url: '/bflight/ordermend/premendinvoice',
      data: params
    }).done((data) => {
      if (data) {
        state.invoiceInfo = data;
      }
    });
  },

  [types.INIT_HOTEL_ORDER_INFO]({ state }, params) {
    http.get({
      url: '/hdocking/booking/preorder',
      data: params
    }).done((data) => {
      if (data) {
        state.hotel = data;
      }
    });
  },

  [types.GET_ORDER_LIST]({ state }, params) {
    http.get({
      url: '/btravel/userOrder/list',
      data: params
    }).done((data) => {
      if (data) {
        if (params.pageNo === 1) {
          state.orders.resultList.length = 0;
        }
        data.resultList = state.orders.resultList.slice(0).concat(data.resultList);
        state.orders = data;
      }
    });
  },

  [types.GET_INSURANCE_PRODUCT_ASYNC]({ state }) {
    http.get({
      url: '/bflight/insurance/product',
      token: false
    }).done((data) => {
      if (data) {
        state.insurance = data;
      }
    });
  },

  [types.GET_SIMPLEDETAIL_ASYNC]({ state }, params) {
    http.get({
      url: '/btravel/travelApply/simpledetail',
      data: params
    }).done((data) => {
      if (data) {
        state.btripinfo = data;
      }
    });
  },

  [types.GET_REFUNDREASONS_ASYNC]({ state }) {
    http.get({
      url: '/bflight/ordermend/refundReason'
    }).done((data) => {
      if (data) {
        state.refundReasons = data;
      }
    });
  },

    [types.GET_HOTEL_ORDER_DETAIL]({ state },params) {
        http.post({
            url: '/hdocking/order/detail',
            data: params
        }).done(function (data) {
            state.orderHotelDetail = data;
        });
    },
    [types.GET_HOTEL_ORDER_COST_DETAIL]({ state },params) {
        http.post({
            url: '/hdocking/order/chargesDetail',
            data: params
        }).done(function (data) {
            state.orderHotelCostDetail = data;
        });
    },
    [types.INIT_HOTEL_INVOICE]({ state },params) {
        http.post({
            url: '/hdocking/orderInvoice/preRecoupInvoice',
            data: params
        }).done(function (data) {
            state.orderHotelInvoice = data;
        });
    },
    [types.POST_HOTEL_INVOICE]({ state },params) {
        return http.post({
            url: '/hdocking/orderInvoice/recoupInvoice',
            data: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    [types.PAY_HOTEL_CHANGE_ORDER]({ state },params) {
        return http.post({
            url: '/hdocking/booking/amendPay',
            data: params
        });
    }
    ,
    [types.CHECK_MONTH_PAY_STATUS]({ state },params) {
        return http.post({
            url: '/btravel/monthlyapply/payChannel',
            data: params
        }).done(function (res) {
            state.monthlyApplyStatus = res;
        });
    }
};


export default {
    state,
    mutations,
    actions
};