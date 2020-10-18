import request from '@/utils/request'

export function getSelectors(params) {
  return request({
    url: '/monitor/selectors?t=' + (new Date()).getTime(),
    method: 'GET',
    params
  })
}

export async function addSelectors(params) {
  return request({
    url: '/monitor/selectors?t=' + (new Date()).getTime(),
    method: 'POST',
    data: 'selector=' + params
  })
}

export async function updateSelectors(params) {
  return request({
    url: '/monitor/selectors?t=' + (new Date()).getTime(),
    method: 'PUT',
    data: { 'selector': params }
  })
}

export async function deleteSelectors(params) {
  return request({
    url: '/monitor/selectors?t=' + (new Date()).getTime(),
    method: 'DELETE',
    data: { 'selector_id': params }
  })
}

export async function addRules(selectorsId, params) {
  return request({
    url: '/monitor/selectors/' + selectorsId + '/rules?t=' + (new Date()).getTime(),
    method: 'POST',
    data: 'rule=' + params
  })
}

export async function updateRules(selectorsId, params) {
  return request({
    url: '/monitor/selectors/' + selectorsId + '/rules?t=' + (new Date()).getTime(),
    method: 'PUT',
    data: { 'rule': params }
  })
}

export async function deleteRules(selectorsId, params) {
  return request({
    url: '/monitor/selectors/' + selectorsId + '/rules?t=' + (new Date()).getTime(),
    method: 'DELETE',
    data: { 'rule_id': params }
  })
}

export async function oderSelectors(params) {
  return request({
    url: '/monitor/selectors/order?t=' + (new Date()).getTime(),
    method: 'PUT',
    data: 'order=' + params
  })
}

export async function orderRules(selectorsId, params) {
  return request({
    url: '/monitor/selectors/' + selectorsId + '/rules/order?t=' + (new Date()).getTime(),
    method: 'PUT',
    data: 'order=' + params
  })
}

export function fetchConfig(params) {
  return request({
    url: '/monitor/fetch_config?t=' + (new Date()).getTime(),
    method: 'GET',
    params
  })
}

export function enablePlug(params) {
  return request({
    url: '/monitor/enable?t=' + (new Date()).getTime(),
    method: 'POST',
    data: 'enable=' + params
  })
}

export async function syncPlugData() {
  return request({
    url: '/monitor/sync?t=' + (new Date()).getTime(),
    method: 'POST'
  })
}

export function getRules(params) {
  return request({
    url: '/monitor/selectors/' + params + '/rules?t=' + (new Date()).getTime(),
    method: 'GET',
    params
  })
}
