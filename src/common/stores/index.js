'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import booking from './booking/mutations';
import btrip from './btrip/mutations';
import order from './order/mutations';

Vue.use(Vuex);
export default new Vuex.Store({
    modules:{
        booking,btrip,order
    }
});
