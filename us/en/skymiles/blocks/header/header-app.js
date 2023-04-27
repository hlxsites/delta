export default class HeaderAppWrapper extends HTMLElement {
  static setBase() {
    const p = document.createElement('base');
    p.href = document.location;
    document.head.append(p);
  }

  static async loadScript(src, options = {}) {
    const script = document.createElement('script');
    script.src = src;
    if (options.defer) {
      script.defer = options.defer;
    }
    if (options.async) {
      script.async = options.async;
    }
    return new Promise((resolve) => {
      script.onload = () => resolve(script);
      document.head.append(script);
    });
  }

  static template() {
    const HEADER_APP_VERSION = '23.6.100';
    const template = document.createElement('template');
    template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="/content/dam/delta-applications/ui-kit/23.5.11/variables.css" data-css-include="true"/>
    <link rel="stylesheet" type="text/css" href="https://st.delta.com/content/dam/delta-applications/fresh-air/css/fresh-air.css"/>
    <link rel="stylesheet" type="text/css" href="https://st.delta.com/content/dam/delta-applications/fresh-air-core/23.3.0/fonts/fresh-air-fonts.css"/>
    <script type="text/javascript" src="https://content.delta.com/content/dam/delta/fresh-air/js/jquery-3.5.1.min.js"></script>
    <script type="text/javascript" src="https://tms.delta.com/delta/dl_bastian/Bootstrap.js"></script>
    <script type="text/javascript" src="https://content.delta.com/content/dam/delta-applications/js/sitewide/v22.8.0/swrcq.js"></script>
    <script type="text/javascript" src="https://st.delta.com/content/dam/delta-applications/homepage/header/${HEADER_APP_VERSION}/runtime.js" defer></script>
    <script type="text/javascript" src="https://st.delta.com/content/dam/delta-applications/homepage/header/${HEADER_APP_VERSION}/polyfills.js" defer></script>
    <script type="text/javascript" src="https://st.delta.com/content/dam/delta-applications/homepage/header/${HEADER_APP_VERSION}/main.js" defer></script>
    <script type="text/javascript" src="https://qat3-content.delta.com/content/dam/delta-applications/login-modal/23.5.13/element.js" defer></script>
    <header-app></header-app>
    <idp-login-modal-profile-selector></idp-login-modal-profile-selector>`;
    return template;
  }

  setInitialState() {
    const script = document.createElement('script');
    script.id = 'home-state';
    script.type = 'application/json';
    script.textContent = '{&q;CONFIG&q;:{&q;APP&q;:&q;homepage&q;,&q;APP_NOTIFICATION_GROUP&q;:&q;home&q;,&q;APP_CONTEXT_ROOT&q;:&q;home&q;,&q;APP_DEVICE_TYPE_URL&q;:&q;\u002Fdevicetype&q;,&q;APP_RSS_NEWS_URL&q;:&q;\u002Frss\u002Fnews&q;,&q;APP_PREDICTIVE_CITIES_URL&q;:&q;\u002Fpredictivetext\u002FgetPredictiveCities&q;,&q;APP_PREF_GEOLOCATION_URL&q;:&q;\u002Fpref\u002FgeoLocationService\u002FgetClosestDeltaAirportCode&q;,&q;APP_TRIPS_TODAY_URL&q;:&q;\u002Fmyaccount\u002Ftrip\u002FtodaysTrip&q;,&q;APP_TRIPS_UPCOMING_TRIP_URL&q;:&q;\u002Fmyaccount\u002Ftrip\u002FmostUpcomingTrip&q;,&q;APP_TRIPS_NOTIFICATION_URL&q;:&q;\u002Fmytrips\u002FgetMessageData.action&q;,&q;APP_UTIL_LOOKUP_PROVINCES_URL&q;:&q;\u002Futil\u002Fprovinces&q;,&q;APP_UTIL_LOOKUP_COUNTRIES_URL&q;:&q;\u002Futil\u002Fcountries&q;,&q;APP_UTIL_LOOKUP_AIRPORTS_URL&q;:&q;\u002Futil\u002Fairports&q;,&q;APP_UTIL_MOBILE_COMPRESS_URL&q;:&q;\u002Futils\u002FcompressAndEncode&q;,&q;APP_HOME_CONTENT_URL&q;:&q;\u002Fcontent\u002Fwww\u002Fus\u002Fen\u002Fhome.content.html&q;,&q;APP_MESSAGES_ERROR_URL&q;:&q;\u002Fcontent\u002Fwww\u002Fdelta-homepage-redesign-whitelabel\u002Ferrormessage.errormessage.json&q;,&q;APP_CONTENT_CONFIG_URL&q;:&q;\u002Fcontent\u002Fwww\u002F\u007Bparam1\u007D\u002Fen.headerfooter.json&q;,&q;APP_PE_DATA_URL&q;:&q;\u002Fpersonalization-api\u002FgetpersonalizedContent&q;,&q;APP_UNSUPPORTED_REDIRECT_URL&q;:&q;\u002Fdlhome\u002Findex.jsp&q;,&q;APP_FORCE_REDIRECT&q;:&q;\u002Fdlhome\u002Findex.jsp&q;,&q;APP_SESS_CUSTOMER_DATA_URL&q;:&q;\u002Flogin\u002Flogin\u002FgetDashBrdData&q;,&q;APP_SESS_CUSTOMER_EDP_DATA_URL&q;:&q;\u002Fpref\u002FprefsController\u002FsaveDetails&q;,&q;APP_SESS_CUSTOMER_EDP_DATAUPDATE_URL&q;:&q;\u002Fpref\u002FprefsController\u002FupdateCache&q;,&q;APP_SESS_CUSTOMER_EDP_RETRIEVE_URL&q;:&q;\u002Fpref\u002FprefsController\u002FretrieveDetails&q;,&q;APP_SESS_CUSTOMER_LOGOUT_URL&q;:&q;\u002Fcustlogin\u002Flogout.action&q;,&q;APP_SESS_CUSTOMER_ACCTACTVTY_URL&q;:&q;\u002Facctactvty\u002Fmyskymiles.action&q;,&q;APP_SESS_CUSTOMER_MYDELTA_URL&q;:&q;\u002Fmydelta\u002Fdashboard&q;,&q;APP_SESS_CUSTOMER_TRACKER_URL&q;:&q;\u002Fmyaccount\u002Ftracker\u002FtrackerData&q;,&q;APP_SESS_CUSTOMER_GETPREFILL_URL&q;:&q;\u002Fprefill\u002FretrieveSearch?searchType\u003DRecentSearchesJSON&q;,&q;APP_SESS_CUSTOMER_SAVEPREFILL_URL&q;:&q;\u002Fprefill\u002FupdateSearch&q;,&q;APP_SESS_CUSTOMER_SAVEDSEARCH_URL&q;:&q;\u002Fair-shopping\u002FgetSavedSearchList.action&q;,&q;APP_SESS_DATABROKER_URL&q;:&q;\u002Fdatabroker\u002Fbcdata.action&q;,&q;APP_SESS_REFRESH_SESSION_URL&q;:&q;\u002Fshared\u002Fcomponents\u002FrefreshSession.jsp&q;,&q;APP_TIMEOUT_FAST&q;:&q;12000&q;,&q;APP_TIMEOUT_SLOW&q;:&q;30000&q;,&q;APP_RETRIES&q;:&q;3&q;,&q;APP_SESS_TIME_OUT&q;:&q;1320000&q;,&q;APP_TIMEOUT_HEADER_FOOTER&q;:&q;15000&q;,&q;APP_AEM_HOST&q;:&q;delta.com&q;,&q;APP_DARKSITE_LEVEL_0&q;:&q;level0&q;,&q;APP_DARKSITE_LEVEL_1&q;:&q;level1&q;,&q;APP_DARKSITE_LEVEL_2&q;:&q;level2&q;,&q;APP_DARKSITE_LEVEL_3&q;:&q;level3&q;,&q;APP_ENABLE_RESPONSIVE_BOOK&q;:&q;false&q;,&q;APP_DISABLE_LEGACY&q;:&q;false&q;,&q;APP_HEADERFOOTER_LIGHT_WEIGHT&q;:&q;false&q;,&q;APP_TRACKJS_TOKEN&q;:&q;155b41f470444545829ee11dc1cb03ff&q;,&q;APP_TRACKJS_APPLICATION&q;:&q;home&q;,&q;APP_ENSIGHTEN_URL&q;:&q;\u002F\u002Ftms.delta.com\u002Fdelta\u002Fdl_dvl\u002FBootstrap.js&q;,&q;APP_SLIM_HEADER_PATHS&q;:&q;flight-search,cart&q;,&q;APP_DISABLE_CLS2&q;:&q;false&q;,&q;APP_COUNTRY_LANGUAGE_URL&q;:&q;\u002Fcontent\u002Fdam\u002Ffresh-air\u002Fdatasource\u002Fcountry-language.json&q;,&q;APP_TITLE&q;:&q;false&q;,&q;APP_PREF_COOKIE&q;:&q;en-us&q;,&q;APP_DEFAULT_COUNTRY&q;:&q;us&q;,&q;APP_DEFAULT_BROWSER_LANG&q;:&q;en&q;,&q;APP_URL_MAPPINGS&q;:&q;{ \\&q;us\\&q;: \\&q;us\\&q;, \\&q;mx\\&q;: \\&q;mx\\&q;, \\&q;br\\&q;: \\&q;br\\&q;, \\&q;jp\\&q;: \\&q;jp\\&q;, \\&q;cn\\&q;: \\&q;cn\\&q;, \\&q;kr\\&q;: \\&q;kr\\&q;, \\&q;gb\\&q;: \\&q;gb\\&q;, \\&q;ca\\&q;: \\&q;ca\\&q;, \\&q;au\\&q;: \\&q;apac\\&q;, \\&q;sg\\&q;: \\&q;apac\\&q;, \\&q;hk\\&q;: \\&q;apac\\&q;, \\&q;tw\\&q;: \\&q;apac\\&q;, \\&q;pw\\&q;: \\&q;apac\\&q;, \\&q;ph\\&q;: \\&q;apac\\&q;, \\&q;in\\&q;: \\&q;apac\\&q;, \\&q;apac\\&q;: \\&q;apac\\&q;, \\&q;ar\\&q;: \\&q;lac\\&q;, \\&q;cl\\&q;: \\&q;lac\\&q;, \\&q;co\\&q;: \\&q;lac\\&q;, \\&q;bz\\&q;: \\&q;lac\\&q;, \\&q;cr\\&q;: \\&q;lac\\&q;, \\&q;ec\\&q;: \\&q;lac\\&q;, \\&q;sv\\&q;: \\&q;lac\\&q;, \\&q;gt\\&q;: \\&q;lac\\&q;, \\&q;hn\\&q;: \\&q;lac\\&q;, \\&q;ni\\&q;: \\&q;lac\\&q;, \\&q;pa\\&q;: \\&q;lac\\&q;, \\&q;pe\\&q;: \\&q;lac\\&q;, \\&q;pr\\&q;: \\&q;lac\\&q;, \\&q;cu\\&q;: \\&q;lac\\&q;, \\&q;do\\&q;: \\&q;lac\\&q;, \\&q;ag\\&q;: \\&q;lac\\&q;, \\&q;aw\\&q;: \\&q;lac\\&q;, \\&q;bs\\&q;: \\&q;lac\\&q;, \\&q;bm\\&q;: \\&q;lac\\&q;, \\&q;ky\\&q;: \\&q;lac\\&q;, \\&q;gd\\&q;: \\&q;lac\\&q;, \\&q;ht\\&q;: \\&q;lac\\&q;, \\&q;jm\\&q;: \\&q;lac\\&q;, \\&q;an\\&q;: \\&q;lac\\&q;, \\&q;kn\\&q;: \\&q;lac\\&q;, \\&q;lc\\&q;: \\&q;lac\\&q;, \\&q;sxm\\&q;: \\&q;lac\\&q;, \\&q;tc\\&q;: \\&q;lac\\&q;, \\&q;lac\\&q;: \\&q;lac\\&q;, \\&q;car\\&q;: \\&q;lac\\&q;, \\&q;gh\\&q;: \\&q;mea\\&q;, \\&q;ng\\&q;: \\&q;mea\\&q;, \\&q;sn\\&q;: \\&q;mea\\&q;, \\&q;za\\&q;: \\&q;mea\\&q;, \\&q;ae\\&q;: \\&q;mea\\&q;, \\&q;il\\&q;: \\&q;mea\\&q;, \\&q;mea\\&q;: \\&q;mea\\&q;, \\&q;ch\\&q;: \\&q;eu\\&q;, \\&q;it\\&q;: \\&q;eu\\&q;, \\&q;fr\\&q;: \\&q;fr\\&q;, \\&q;es\\&q;: \\&q;eu\\&q;, \\&q;de\\&q;: \\&q;eu\\&q;, \\&q;nl\\&q;: \\&q;eu\\&q;, \\&q;be\\&q;: \\&q;eu\\&q;, \\&q;ie\\&q;: \\&q;eu\\&q;, \\&q;ru\\&q;: \\&q;eu\\&q;, \\&q;pt\\&q;: \\&q;eu\\&q;, \\&q;cz\\&q;: \\&q;eu\\&q;, \\&q;dk\\&q;: \\&q;eu\\&q;, \\&q;gr\\&q;: \\&q;eu\\&q;, \\&q;is\\&q;: \\&q;eu\\&q;, \\&q;se\\&q;: \\&q;eu\\&q;, \\&q;eu\\&q;: \\&q;eu\\&q; }&q;,&q;APP_ENV&q;:&q;qat&q;,&q;APP_COOKIE_DOMAIN&q;:&q;;domain\u003D.delta.com; path\u003D\u002F&q;,&q;APP_OLD_FLIGHT_STATUS&q;:&q;false&q;,&q;APP_SHOP_HEADER&q;:&q;false&q;,&q;APP_LOGOUT_URL_FROM_PROPERTY&q;:&q;true&q;,&q;APP_NEW_LOGOUT_URL&q;:&q;\u002Flogin\u002Flogin\u002Flogout&q;,&q;APP_DISABLE_METASEARCH&q;:&q;true&q;,&q;APP_BAU_OR_STATIC_PG&q;:&q;true&q;,&q;APP_BUSINESS_ACCOUNTS&q;:&q;CNA,TRIP,SME&q;,&q;APP_TRIP_ACCOUNT&q;:&q;TRIP&q;,&q;APP_BUSINESS_OA_SME_ACCOUNTS&q;:&q;BBIZ,CRG3,CRAM,SKYB&q;,&q;APP_CORPORATE_AGREEMENT_TYPE_CODE&q;:&q;edp:EDP,edpCna:CNA,concur:TRIP,concurold:CONCUR,nutravel:NTVL,sme:SME,corporateRewards:CRWD,noprogram:NPGM&q;,&q;APP_MEETING_CODE&q;:&q;NPGM,CRWD,SME&q;,&q;APP_MEETING_INLINE_TEXT&q;:&q;rewards:rewards,noprogram:noprogram,fare:fare,personal:personal&q;,&q;APP_RESTRICTED_PAGES_FOR_BUSINESS&q;:&q;\u002Fflight-search\u002F,\u002Freshop\u002F,\u002Fseat-map\u002FISM\u002F,\u002Fcart\u002Factivity\u002Ftripsummary.action,\u002Fcart\u002Factivity\u002Fpassengerinfo.action,\u002Fcart\u002Factivity\u002FreviewFlight.action,\u002Fcomplete-purchase\u002Ftrip-summary,\u002Fedocs\u002F,\u002Fedocs\u002Fredeem-documents,\u002Fcomplete-purchase\u002Fexpress-checkout,\u002Fcomplete-purchase\u002Freview-pay&q;,&q;APP_SHOW_NEW_FLYOUT&q;:&q;true&q;,&q;APP_FLIGHT_SEARCH_DATE&q;:&q;true&q;,&q;APP_MOBILE_RSB&q;:&q;true&q;,&q;APP_GET_DEFAULTS_AND_LOOKUPS&q;:&q;\u002Fshop\u002Fdefaultsandlookups&q;,&q;APP_MYTRIPS_LABEL&q;:&q;My Trips&q;,&q;APP_MYTRIPS_URL&q;:&q;\u002Fmytrips\u002F&q;,&q;APP_SITESEARCH_TURN_OFF&q;:&q;false&q;,&q;APP_SITESEARCH_PREDICTIONS_URL&q;:&q;\u002Fsitesearch\u002Fpredictions&q;,&q;APP_SITESEARCH_GOOGLE_SEARCH_ENABLED&q;:&q;true&q;,&q;APP_SITESEARCH_GOOGLE_SEARCH_URL&q;:&q;\u002Fsite-search\u002Fsearch&q;,&q;APP_SITESEARCH_GOOGLE_SEARCH_SSR_ENABLED&q;:&q;false&q;,&q;APP_SITESEARCH_CX&q;:&q;d232b51a93511032c&q;,&q;APP_SITESEARCH_KEY&q;:&q;AIzaSyCVB0Y8AM7cMbWtVwTx2s02n4zymHrEFz8&q;,&q;APP_SITESEARCH_DIRECT_URL&q;:&q;https:\u002F\u002Fwww.googleapis.com\u002Fcustomsearch\u002Fv1\u002Fsiterestrict&q;,&q;APP_PF_COOKIE_RETRIEVE&q;:&q;\u002Fuser-login\u002FgetpfCookie&q;,&q;APP_AUTH_CONFIG_JSON&q;:&q;\u002Fcontent\u002Fdam\u002Fdelta-applications\u002Flogin\u002Fauth-config.json&q;,&q;APP_PING_LOGOUT_URL&q;:&q;\u002Fhttps:\u002F\u002Fsignin.delta.com\u002Fidp\u002FstartSLO.ping?TargetResource\u003D&q;}}';
    this.prepend(script);
  }

  async connectedCallback() {
    HeaderAppWrapper.setBase();
    const useShadowDom = this.attributes.getNamedItem('use-shadow-dom')?.value === 'true';
    if (useShadowDom) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(HeaderAppWrapper.template({}).content.cloneNode(true));
    } else {
      this.innerHTML = HeaderAppWrapper.template({}).innerHTML;
      // document.querySelector('footer').innerHTML += '<footer-app/>';
    }
    this.setInitialState();
    const container = useShadowDom ? this.shadowRoot : this;
    await [...container.querySelectorAll('script[src]:not([defer],[async]')].reduce((promise, script) => {
      script.remove();
      return promise.then(() => HeaderAppWrapper.loadScript(script.src, script));
    }, Promise.resolve());
    await Promise.all([...container.querySelectorAll('script[src]')].map((script) => {
      script.remove();
      return HeaderAppWrapper.loadScript(script.src, script);
    }));
    // manually trigger header initialization
    document.dispatchEvent(new Event('DOMContentLoaded'));
  }
}

customElements.define('header-app-wrapper', HeaderAppWrapper);
