
var pointersKey = ;

var pointerKey = function (id, dataKey) {
    return 'socrates.document.' + id + '.' + dataKey;
};

var deleteDocument = function (id) {

    var ids = loadDocumentIds();
    ids = _.without(ids, id);

    localStorage.setItem(pointersKey, ids.join(','));

    var textKey = pointerKey(id, 'text');
    localStorage.removeItem(textKey);

    var updatedKey = pointerKey(id, 'updated');
    localStorage.removeItem(updatedKey);

    var titleKey = pointerKey(id, 'title');
    localStorage.removeItem(titleKey);
};

var loadDocument = function (id) {

    var textKey = pointerKey(id, 'text');
    var textStr = localStorage.getItem(textKey);

    var updatedKey = pointerKey(id, 'updated');
    var updatedStr = localStorage.getItem(updatedKey);

    var titleKey = pointerKey(id, 'title');
    var titleStr = localStorage.getItem(titleKey);

    if (textStr && updatedStr && titleStr) {
        var doc = new Document();

        doc.id = id;
        doc.text = textStr;
        doc.updated = new Date(updatedStr);
        doc.title = titleStr;

        return doc;

    } else {

        return null;
    }
};

var loadDocumentIds = function () {
    var ids = localStorage.getItem(pointersKey);
    if (ids) {
        return ids.split(',');
    } else {
        return [];
    }
};

var loadDocuments = function () {

    var ids = loadDocumentIds();

    var docs = [];

    _.each(ids, function (id) {
        var doc = loadDocument(id);
        if (doc) docs.push(doc);
        else deleteDocument(id);
    });

    return _.sortBy(docs, function (doc) {
        return doc.updated.getTime();
    });
};


var deleteAllDocuments = function () {

    var ids = loadDocumentIds();

    _.each(ids, function (id) {
        deleteDocument(id);
    });
};


var Document = function () {};

Document.prototype.applyDefaults = function () {
    if (!this.id) this.id = guid();
    if (!this.updated) this.updated = new Date();
    if (!this.title) this.title = this.generateTitle();
};

Document.prototype.save = function (text, markdown) {

    if (!text) text = '';
    if (!markdown) markdown = '';

    this.text = text;
    this.title = this.generateTitle(markdown);

    this.updated = new Date();

    this.applyDefaults();

    this._persist();
};


Document.prototype.generateTitle = function (markdown) {

    if (markdown) {
        var start = markdown.indexOf('<h1>');
        var end = markdown.indexOf('</h1>');
        if (start !== -1 && end !== -1)  {
            return markdown.substring(start + 4, end);
        }
    }

    return 'Untitled - ' + timeSince(this.updated) + " ago";
};

Document.prototype._persist = function () {

    var ids = loadDocumentIds();
    ids.push(this.id);
    ids = _.uniq(ids);

    localStorage.setItem(pointersKey, ids.join(','));

    var textKey = pointerKey(this.id, 'text');
    localStorage.setItem(textKey, this.text);

    var updatedKey = pointerKey(this.id, 'updated');
    localStorage.setItem(updatedKey, this.updated.toISOString());

    var titleKey = pointerKey(this.id, 'title');
    localStorage.setItem(titleKey, this.title);
};

Document.prototype.remove = function () {
    deleteDocument(this.id);
};

