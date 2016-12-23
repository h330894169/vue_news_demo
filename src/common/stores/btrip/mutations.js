'use strict';

import * as types from './mutation-types';
import http from 'common/js/http';

export const state = {
  employees: [],
  leads: [],
  dates: {},
  citys: {},
  postData: {}
};

export const mutations = {
  [types.UPDATE_APPROVAL](state, obj) {
    state.postData = Object.assign({}, state.postData, obj);
  },

  [types.ADD_EMPLOYEES](state, employees) {
    state.employees = employees;
  },

  [types.ADD_LEADS](state, lead) {
    if (!state.leads.some((n) => {
        return n.id === lead.id;
      })) {
      state.leads.push(lead);
    }
  },

  [types.SELECT_DATES](state, { begin, end }) {
    state.dates = {
      begin: begin,
      end: end
    };
  },

  [types.SELECT_CITYS](state, { begin, end }) {
    if (begin) {
      state.citys.begin = begin;
    }
    if (end) {
      state.citys.end = end;
    }
  }
};

export const actions = {

  [types.INIT_APPROVAL_ASYNC]({ commit, state }, id) {
    if (id) {
      http.get({
        url: '/btravel/travelH5/applyDetail',
        data: {
          applyId: id
        }
      }).done((res) => {
        state.employees = res.traveler.map((n) => {
          return {
            id: n.employeeId,
            phone: n.employeePhone,
            name: n.employeeName,
            sequence: n.sequence
          };
        });
        state.dates = {
          begin: res.startTime.slice(0, 10),
          end: res.endTime.slice(0, 10)
        };
        state.citys.begin = {
          cityID: res.startCityId,
          city: res.startCity
        };
        const arr = res.targetCityIds.split(',');
        const arr2 = res.targetCities.split(',');
        state.citys.end = arr.map((n, i) => {
          return {
            cityID: n,
            city: arr2[i]
          };
        });
        state.leads = res.approver.map((n) => {
          return {
            id: n.employeeId,
            phone: n.employeePhone,
            name: n.employeeName,
            sequence: n.sequence
          };
        });
        const obj = {};
        obj.applyId = res.id;
        obj.startTime = state.dates.begin;
        obj.endTime = state.dates.end;
        obj.travelPurpose = res.travelPurpose;
        obj.travelExplain = res.travelExplain;
        obj.license = res.certificate;
        commit(types.UPDATE_APPROVAL, obj);
      });
    } else {
      if (!state.citys.begin) {
        state.citys.begin = {
          city: window.INFO.cityName,
          cityID: window.INFO.cityId
        };
      }
      if (!state.dates.begin) {
        require.ensure([], function(require) {
            var moment =  require('moment');
            const current = moment();
            state.dates = {
                begin: current.format('YYYY-MM-DD'),
                end: current.add(1, 'days').format('YYYY-MM-DD')
            };
        })
      }
    }
  }
};

export default {
    state,
    mutations,
    actions
};