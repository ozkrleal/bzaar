import * as Actions from '../actionTypes/myStores';
import { ApiUtils } from '../utils/api';

function request() {
  return {
    type: Actions.REQUEST_MYSTORES,
  };
}

function receive(data) {
  return {
    type: Actions.RECEIVE_MYSTORES,
    ...data,
  };
}

function receiveError(error) {
  return {
    type: Actions.RECEIVE_ERROR,
    error,
  };
}

export function list(jwt) {
  return (dispatch) => {
    dispatch(request());
    return ApiUtils.request('my_stores', jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}

export function openStore(data) {
  return dispatch => dispatch({ type: Actions.OPEN_MYSTORE, data });
}

export function openNewStore() {
  const data = {
    id: 0,
    name: '',
    description: '',
    logo: '',
    email: '',
  };
  return dispatch => dispatch({ type: Actions.OPEN_NEW_STORE, data });
}

export function editStore(data) {
  return dispatch => dispatch({ type: Actions.EDIT_STORE, data });
}

export function openProducts(storeId) {
  return dispatch => dispatch({ type: Actions.OPEN_PRODUCTS, storeId });
}

export function editProduct(data) {
  return dispatch => dispatch({ type: Actions.EDIT_PRODUCT, data });
}

export function onChangeProduct(data) {
  return dispatch => dispatch({ type: Actions.PRODUCT_CHANGED, data });
}

export function editProductImages(data) {
  return dispatch => dispatch({ type: Actions.EDIT_PRODUCT_IMAGES, data });
}

export function editProductSize(size) {
  return dispatch => dispatch({ type: Actions.EDIT_SIZE, size });
}

export function addSizeAction(size) {
  return { type: Actions.ADD_SIZE, size };
}

export function addSize(size) {
  return dispatch => dispatch(addSizeAction(size));
}

export function removeSize(size) {
  return dispatch => dispatch({ type: Actions.REMOVE_SIZE, size });
}

function requestImage() {
  return {
    type: Actions.REQUEST_IMAGE,
  };
}

function receiveImage(storeId, data) {
  return {
    type: Actions.RECEIVE_IMAGE,
    id: storeId,
    data,
  };
}

function receiveImages(productId, data, sequence, metaData, items) {
  return {
    type: Actions.RECEIVE_PRODUCT_IMAGES,
    productId,
    sequence,
    data,
    metaData,
    items,
  };
}

function uploadImage() {
  return {
    type: Actions.UPLOAD_IMAGE,
  };
}

function uploadedImage() {
  return {
    type: Actions.UPLOADED_IMAGE,
  };
}

export function requestStoreSignedURL(jwt, metaData, store) {
  return (dispatch) => {
    dispatch(requestImage());
    return ApiUtils.create(`stores/${store.id}/upload_image`, jwt, metaData)
      .then((data) => {
        dispatch(receiveImage(store.id, data));
        return data;
      }).catch(error => ApiUtils.error(error.message));
  };
}

export function requestProductSignedURL(jwt, metaData, product) {
  return (dispatch) => {
    dispatch(requestImage());
    return ApiUtils.create(
      `stores/${product.store_id}/products/${product.id}/product_image/upload`,
      jwt,
      metaData,
    ).then((data) => {
      dispatch(receiveImage(product.id, data));
      return data;
    }).catch(error => ApiUtils.error(error.message));
  };
}

export function requestProductImagesSignedURL(jwt, metaData, product, sequence, items) {
  return (dispatch) => {
    dispatch(requestImage());
    return ApiUtils.create(
      `stores/${product.store_id}/products/${product.id}/product_images/upload`,
      jwt,
      { ...metaData, sequence },
    ).then((data) => {
      dispatch(receiveImages(product.id, data, sequence, metaData, items));
      return data;
    }).catch(error => ApiUtils.error(error.message));
  };
}


export function changeImageSequence(productId, images) {
  return (dispatch) => {
    dispatch({
      type: Actions.CHANGE_IMAGE_SEQUENCE,
      images,
    });
  };
}

export function sendImage(signedURL, imageData, mimetype) {
  return (dispatch) => {
    dispatch(uploadImage());
    return ApiUtils.upload(signedURL, imageData, mimetype)
      .then(() => {
        dispatch(uploadedImage());
        return true;
      })
      .catch((error) => {
        dispatch(uploadedImage());
        ApiUtils.error(`Não foi possivel enviar a imagem: ${error}`);
        return false;
      });
  };
}

export function saveStore() {
  return {
    type: Actions.SAVE_STORE,
  };
}

export function savedStore(data) {
  return {
    type: Actions.SAVED_STORE,
    ...data,
  };
}

export function updateStore(jwt, store) {
  const { id } = store;
  return (dispatch) => {
    dispatch(saveStore());
    return ApiUtils.create(`stores/${id}`, jwt, { store }, 'PUT')
      .then(data => dispatch(savedStore(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

export function createStore(jwt, store) {
  return (dispatch) => {
    dispatch(saveStore());
    return ApiUtils.create('stores', jwt, { store }, 'POST')
      .then(data => dispatch(savedStore(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

function requestProducts() {
  return {
    type: Actions.REQUEST_PRODUCTS,
  };
}

function receiveProducts(data) {
  return {
    type: Actions.RECEIVE_PRODUCTS,
    ...data,
  };
}

export function listProducts(jwt, storeId) {
  return (dispatch) => {
    dispatch(requestProducts());
    return ApiUtils.request(`stores/${storeId}/products`, jwt)
      .then(data => dispatch(receiveProducts(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

export function saveProduct() {
  return {
    type: Actions.SAVE_PRODUCT,
  };
}

export function savedProduct(data) {
  return {
    type: Actions.SAVED_PRODUCT,
    ...data,
  };
}

export function updateProduct(jwt, product) {
  const { store_id, id } = product; // eslint-disable-line camelcase
  return (dispatch) => {
    dispatch(saveProduct());
    return ApiUtils.create(`stores/${store_id}/products/${id}`, jwt, { product }, 'PUT') // eslint-disable-line camelcase
      .then(data => dispatch(savedProduct(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

export function createProduct(jwt, product) {
  const { store_id } = product; // eslint-disable-line camelcase
  return (dispatch) => {
    dispatch(saveProduct());
    return ApiUtils.create(`stores/${store_id}/products`, jwt, { product }, 'POST') // eslint-disable-line camelcase
      .then(data => dispatch(savedProduct(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}
