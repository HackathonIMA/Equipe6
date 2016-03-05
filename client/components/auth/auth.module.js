'use strict';

angular.module('hackatonApp.auth', [
  'hackatonApp.constants',
  'hackatonApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
