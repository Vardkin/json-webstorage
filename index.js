/*!
  * json-webStorage-ctl <https://github.com/Vardkin/json-webstorage.git>
  *
  * Copyright (c) 2018, Kasey Wright.
  * Licensed under the MIT License.
  *
  * Easily store and retrieve objects and arrays from webstorage.
  * Arrays and Objects will be stored as JSON strings in the
  * specified webstorage. By default, it will set values
  * to localStorage and not sessionStorage. All other
  * data types will be stored regularly as per
  * the webstorage specification.
  * <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API>
  */


exports = json_webStorage_ctl = (function() {
  let storage_type;

  /**
  * When requesting a key, it will parse the JSON string and return the value
  * @param {String} key: name to reference stored data
  * @param {Boolean} storage: type of webstorage to use - 1 = sessionStorage
  * @return {Mixed} the stored value, if any
  * @public
  */
  const getValue = ( key, storage = false) => {
    let value, result;

    // resolve storage type
    resolveStorageType( storage );

    // fetch requested value
    value = storage_type.getItem( key );

    // parse and return
    try {
      result = JSON.parse( value );
    } catch ( e ) {
      return value;
    }
    return result;
  }


  /**
  * Set a value in webStorage.
  * @param {String} key: name to reference stored data
  * @param {Mixed} value: data to be stored in web storage as JSON string
  * @param {Boolean} storage: type of webstorage to use - 1 = sessionStorage
  * @public
  */
  const setValue = ( key, value, storage = false ) => {
    let parse_value;

    // resolve storage type
    resolveStorageType( storage );

    // resolve type of data
    parse_value = resolveDataType( value );

    if (parse_value) {
      storage_type.setItem( key, JSON.stringify( value ) )
      return;
    }
    storage_type.setItem( key, value )
  }


  /**
  * Remove a value from webStorage.
  * @param {String} key: name to reference stored data
  * @public
  */
  const removeValue = ( key ) => {
    // resolve storage type
    resolveStorageType( storage );

    storage_type.removeItem( 'key' );
  }


  /**
   * Clear all webStorage for the domain
   * No warnings or frills, just cleans house.
   * @public
   */
  const clearAll = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }

  /**
   * set webStorage
   * @private
   */
  const resolveStorageType = ( storage ) => {
    storage_type = ( storage ) ?  window.sessionStorage : window.localStorage ;
  }

  /**
   * evaluate data type of value to store
   * @return {Boolean}
   * @private
   */
  const resolveDataType = ( value ) => {
    if ( Array.isArray( value ) )
      return true;

    if ( value && typeof value === 'object' && value.constructor === Object )
      return true;

    return false;
  }

  /**
   * API
   * @return {Object}
   * @public
   */
  return {
    get: getValue,
    set: setValue,
    remove: removeValue,
    clear: clearAll
  }
}());


/* getValue test
localStorage.setItem( 'form', JSON.stringify({ 'id': 1, 'name': 'new' }) );
sessionStorage.setItem( 'session', 'only' );

console.log( aport_webStorage_ctl.get( 'form') );// expects object
console.log( aport_webStorage_ctl.get( 'session') ); // expects null
console.log( aport_webStorage_ctl.get( 'session', true) ); // expects 'only'
*/

/* resolveDataType test: note - first expose function
aport_webStorage_ctl.type_( [ 'id', 1, 'name','new' ] ) // expects true
aport_webStorage_ctl.type_( { 'id': 1, 'name': 'new' } ) // expects true
// any other data type expects false
*/
