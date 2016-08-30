import config from 'frontend/config/environment';

const PREFIX = config.APP.NAMESPACE;

// API Urls
export const TICKETS_URL = `${PREFIX}/tickets/`;

export const TICKET_LIST_URL = '/tickets/index';

var BASEURLS = {
  base_tickets_url: '/tickets',
};


export default BASEURLS;
