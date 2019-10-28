import { Meteor } from 'meteor/meteor';
import { InjectData } from './namespace';
import { _ } from 'meteor/underscore';

// Automatically parse the inject-data payload on Meteor startup
// Load it into memory so it can be fetched by InjectData.getData
Meteor.startup(function () {
	var dom = document.querySelectorAll(
		'script[type="text/inject-data"]',
		document
	);
	var injectedDataString = dom && dom.length > 0 ? dom[0].innerHTML : '';
	InjectData._data = InjectData._decode(injectedDataString) || {};
});

/**
 * Returns the data payload for the specified key.
 * @param {string} key
 * @param removeData
 * @param {function} callback
 */
InjectData.getData = function (key, callback, removeData) {
	Meteor.startup(function () {
		if (removeData) {
			delete InjectData._data[key];
		}
		callback(InjectData._data[key]);
	});
};

InjectData.getDataSync = function (key) {
	// remove after we retrieve once. This aids in processing with a route that looks to see if we have this data.
	return key && InjectData && InjectData._data && InjectData._data[key];
};


InjectData.removeData = function (key) {
	// remove after we retrieve once. This aids in processing with a route that looks to see if we have this data.
	const returnData = key && InjectData && InjectData._data && InjectData._data[key];
	if (returnData) {
		delete InjectData._data[key];
	}
};
