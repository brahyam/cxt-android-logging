/**
 * Created by Brahyam on 22/6/2017.
 */

module.exports = {
  /**
   * Gets an app package name and returns the last
   * module name capitalized
   * @param packageName String containing a package name i.e. com.connexient.medinav.uab
   * @return String containing last segment of package name capitalized i.e. Uab
   */
  getFlavorNameFromPackage: function (packageName) {
    var splittedName = packageName.split('.');
    var flavorName = splittedName[splittedName.length - 1];
    return flavorName.substring(0, 1).toUpperCase() + flavorName.substring(1);
  },

  /**
   * Gets all custom data values and returns only key data if exists
   * @param customData String containing all report custom data (value pairs)
   * @return String containing field key to extract
   */
  getCustomData: function (key, customData) {
    var keyValuePairs = customData.split(',');
    for (var i = 0; i < keyValuePairs.length; i++) {
      var splitedValue = keyValuePairs[i].split('=');
      if (splitedValue[0].trim().indexOf(key) !== -1) {
        return splitedValue[1].trim();
      }
    }
  }
};