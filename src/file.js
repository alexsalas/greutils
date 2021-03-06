/**
 * This is a set of functions for common file operations.
 *
 * @public
 * @name GREUtils.File
 * @namespace GREUtils.File
 */
GREUtils.define('GREUtils.File');

GREUtils.File = {

    FILE_RDONLY:       0x01,
    FILE_WRONLY:       0x02,
    FILE_RDWR:         0x04,
    FILE_CREATE_FILE:  0x08,
    FILE_APPEND:       0x10,
    FILE_TRUNCATE:     0x20,
    FILE_SYNC:         0x40,
    FILE_EXCL:         0x80,

    FILE_READ_MODE: "r",
    FILE_WRITE_MODE: "w",
    FILE_APPEND_MODE: "a",
    FILE_BINARY_MODE: "b",

    NORMAL_FILE_TYPE: 0x00,
    DIRECTORY_TYPE:   0x01,

    FILE_CHUNK: 1024, // buffer for readline => set to 1k
    FILE_DEFAULT_PERMS: 0644,
    DIR_DEFAULT_PERMS:  0755
};


/**
 * Returns a reference object to a local file location.<br/>
 * <br/>
 * This method takes a string representing the full file path and returns an nsILocalFile
 * object representing that file location.<br/>
 * <br/>
 * If "notCheckExists" is true, then the method returns the reference object
 * even if no file exists at the given path. When "notCheckExists" is false,
 * a file is created at the given path if it does not already exist and if
 * "autoCreate" is true.<br/>
 * <br/>
 * If no file exists at the location or cannot be created (if "autoCreate" is true),
 * null is returned.
 *
 * @public
 * @static
 * @function
 * @param {String} sFile          This is the full path to the file
 * @param {Boolean} autoCreate    This flag indicates whether the file should be created if it does not exist; defaults to false
 * @param {Boolean} notCheckExists This flag indicates whether the file does not exist; defaults to false
 * @return {nsILocalFile}         The file location reference
 */
GREUtils.File.getFile = function(sFile){
    
    if (sFile instanceof Components.interfaces.nsIFile ) return sFile;

    var autoCreate = arguments[1] || false;
    var notcheckExists = arguments[2] || false;
    if (/^file:/.test(sFile))
        sFile = sFile.replace("file://", "");
        
    var obj = GREUtils.XPCOM.createInstance('@mozilla.org/file/local;1', 'nsILocalFile');
    obj.initWithPath(sFile);
    
    if (obj.exists() || notcheckExists)
        return obj;
    else
    if (autoCreate) {
        try {
            obj.create(GREUtils.File.NORMAL_FILE_TYPE, GREUtils.File.FILE_DEFAULT_PERMS);
            return obj;
        }
        catch (ex) {
            return null;
        }
    }
    else {
        return null;
    }
};


/**
 * Constructs an URL reference from an URL string.
 *
 * This method takes a URL string and returns the corresponding URL object. If
 * the URL points to a file resource (i.e. protocol="file:"), this method returns
 * an nsIFileURL. Otherwise an nsIURL is returned.
 *
 * @public
 * @static
 * @function
 * @param {String} sURL           This is the URL string
 * @return {nsIURL|nsIFileURL}    An URL object
 */
GREUtils.File.getURL = function(sURL){
    var mURL = null;
    if (!/^file:/.test(sURL)) {
        mURL = GREUtils.XPCOM.createInstance("@mozilla.org/network/standard-url;1", "nsIURL");
        mURL.spec = sURL;
    }
    else {
        mURL = GREUtils.XPCOM.getService("@mozilla.org/network/io-service;1", "nsIIOService").newURI(sURL, "UTF-8", null);
        mURL = GREUtils.XPCOM.queryInterface(mURL, "nsIFileURL");
    }
    return mURL;
};


/**
 * Opens an output stream on a local file.
 *
 * This method opens an output stream on the specified file with the given mode
 * and permission. The file is specified either with a string containing its path, or
 * with a file location reference (nsILocalFile). The file is created with
 * the specified permission if it does not already exist.
 *
 * The mode flag can contain valid combinations of the following:
 *
 *  - "w" (write-only)
 *  - "a" (append)
 *  - "b" (binary)
 *
 * Normally an nsIFileOutputStream object is returned; however, if binary mode ("b") is
 * specified, this method returns an nsIBinaryOutputStream
 * object instead.
 *
 * Returns null if the local file cannot be read or if it cannot be created.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @param {String} mode           This is the mode flag
 * @param {Number} perm           This is the permission with which to create the file (if needed)
 * @return {nsIFileOutputStream|nsIBinaryOutputStream}                       A file output stream
 */
GREUtils.File.getOutputStream = function(file, mode, perm){
    var nsIFile = (typeof(file) == "string") ? this.getFile(file) : file;

    var NS_MODE = (GREUtils.File.FILE_TRUNCATE | GREUtils.File.FILE_WRONLY);
    if (typeof(mode) == "string" && mode.indexOf("w") != -1)
        NS_MODE = (GREUtils.File.FILE_TRUNCATE | GREUtils.File.FILE_WRONLY);
    if (typeof(mode) == "string" && mode.indexOf("a") != -1)
        NS_MODE = (GREUtils.File.FILE_APPEND | GREUtils.File.FILE_RDWR);

    var nsPerm = perm || GREUtils.File.FILE_DEFAULT_PERMS;

    if (nsIFile == null) {
        var nsIFile = GREUtils.XPCOM.createInstance('@mozilla.org/file/local;1', 'nsILocalFile');
        nsIFile.initWithPath(file);
        nsIFile.create(GREUtils.File.NORMAL_FILE_TYPE, nsPerm);
    }

    var fs = GREUtils.XPCOM.createInstance("@mozilla.org/network/file-output-stream;1", "nsIFileOutputStream");

    fs.init(nsIFile, NS_MODE, nsPerm, null);

    if (typeof(mode) == "string" && mode.indexOf("b") != -1) {
        var binstream = GREUtils.XPCOM.createInstance("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream");
        binstream.setOutputStream(fs);
        return binstream;
    }
    else
        return fs;

};

/**
 * Opens an input stream on a local file.
 *
 * This method opens an input stream on the specified file with the given mode
 * and permission. The file is specified either with a string containing its path, or
 * with a file location reference (nsILocalFile). Null is returned if the file does
 * not already exist.
 *
 * The file is opened in read-only mode.
 *
 * Normally an nsIScriptableInputStream object is returned; however, if binary mode ("b")
 * is specified (through the "mode" parameter), this method returns an nsIBinaryInputStream
 * object instead.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @param {String} mode           This is the mode flag
 * @param {Number} perm           This is the permission with which to create the file (if needed); defaults to FILE_DEFAULT_PERMS
 * @return {nsIScritableInputStream|nsIBinaryInputStream}                   A file output stream
 */
GREUtils.File.getInputStream = function(file, mode, perm){
    var nsIFile = (typeof(file) == "string") ? this.getFile(file) : file;

    if (nsIFile == null)
        return null;

    var NS_MODE = GREUtils.File.FILE_RDONLY;
    if (typeof(mode) == "string" && mode.indexOf("r") != -1)
        NS_MODE = GREUtils.File.FILE_RDONLY;

    var nsPerm = perm || GREUtils.File.FILE_DEFAULT_PERMS;

    var fs = GREUtils.XPCOM.createInstance("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream");

    fs.init(nsIFile, NS_MODE, nsPerm, null);

    if (typeof(mode) == "string" && mode.indexOf("b") != -1) {
        var binstream = GREUtils.XPCOM.createInstance("@mozilla.org/binaryinputstream;1", "nsIBinaryInputStream");
        binstream.setInputStream(fs);
        return binstream;
    }
    else {
        var scriptstream = GREUtils.XPCOM.createInstance("@mozilla.org/scriptableinputstream;1", "nsIScriptableInputStream");
        scriptstream.init(fs);
        return scriptstream;
    }
};

/**
 * Opens a line input stream on a local file.
 *
 * This method opens a read-only input stream on the specified file. The file is
 * specified either with a string containing its path, or with a file location
 * reference (nsILocalFile).
 *
 * This method returns an nsILineInputStream, or null if the file cannot be opened
 * for reading.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @return {nsIScritableInputStream|nsIBinaryInputStream}                       A file output stream
 */
GREUtils.File.getLineInputStream = function(file){
    var nsIFile = (typeof(file) == "string") ? this.getFile(file) : file;
    if (nsIFile == null)
        return null;

    var fs = GREUtils.XPCOM.createInstance("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream");
    fs.init(nsIFile, GREUtils.File.FILE_RDONLY, GREUtils.File.FILE_DEFAULT_PERMS, null);
    return GREUtils.XPCOM.queryInterface(fs, "nsILineInputStream");
};


/**
 * Reads in the entire content of a file as a series of lines.
 *
 * This method reads in the specified file on a line-by-line basis, where each line
 * is a possibly zero-length sequence of 8-bit characters terminated by a CR, LF, CRLF,
 * LFCR, or EOF.
 *
 * This method returns the content of the file as an array of lines, with the line
 * terminators stripped out.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @return {Array of String}      The file content as an array of lines
 */
GREUtils.File.readAllLine = function(file){
    var lineStream = this.getLineInputStream(file);
    var lines = [];
    var buf = {
        value: ""
    };

    if (!lineStream)
        return lines;

    do {
        var rv = lineStream.readLine(buf);
        lines.push(buf.value);
    }
    while (rv);

    lineStream.close();
    return lines;
};

/**
 * Reads in the entire content of a file as a series of bytes.
 *
 * This method reads in the specified file as a binary stream containing untagged,
 * big-endian binary data.
 *
 * This method returns the content of the file as a binary String.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @return {String}               The file content as a binary String
 */
GREUtils.File.readAllBytes = function(file){
    var nsIFile = (typeof(file) == "string") ? this.getFile(file) : file;
    var size = nsIFile.fileSize;
    var binStream = this.getInputStream(nsIFile, "rb", GREUtils.File.FILE_DEFAULT_PERMS);
    var binaryString = binStream.readBytes(size);
    binStream.close();
    return binaryString;

};

/**
 * Retrieves the content located at an URL.
 *
 * This method retrieves the content located at the given URL, which can reference
 * a remote location. The content is returned as a String. If the URL cannot be
 * retrieved, an empty string is returned.
 *
 * @public
 * @static
 * @function
 * @param {String} aURL           This is the URL from which to retrieve content
 * @return {String}               The URL content as a String
 */
GREUtils.File.getURLContents = function(aURL) {

    var ioService=GREUtils.XPCOM.getService("@mozilla.org/network/io-service;1", "nsIIOService");
    var scriptableStream=GREUtils.XPCOM.getService("@mozilla.org/scriptableinputstream;1", "nsIScriptableInputStream");

    var str = "";
    try {
        var channel=ioService.newChannel(aURL,null,null);
        var input=channel.open();
        scriptableStream.init(input);

        var bytes;
        while ((bytes = input.available()) > 0) {
            str += scriptableStream.read(bytes);
        }
        scriptableStream.close();
        input.close();

    }catch(e) {

    }
    return str;
};

/**
 * Writes an array of strings to a file.
 *
 * This method takes a array of strings and write each string in order to a file.
 * A newline character ('\n') is appended to each string before writing.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @param {Array} lines           This is the Array of Strings to write
 */
GREUtils.File.writeAllLine = function(file, lines){
    var outputStream = this.getOutputStream(file, "w");

    if (!outputStream)
        return;

    lines.forEach(function(buf){
        buf = "" + buf;
        outputStream.write(buf + "\n", buf.length + 1);
    });

    outputStream.close();
};

/**
 * Writes a binary data to a file.
 *
 * @public
 * @static
 * @function
 * @param {Object} file           This is the file. It can be a string containing the file path or a file location reference
 * @param {String} buf            This is the binary data to write
 */
GREUtils.File.writeAllBytes = function(file, buf){
    var outputStream = this.getOutputStream(file, "wb");

    if (!outputStream)
        return;

    outputStream.write(buf, buf.length);

    outputStream.close();
};


/**
 * Spawns a new process to run an executable file.
 *
 * This method runs an executable file in a newly spawned process. The "aArgs" parameter
 * contains a array of arguments to pass to this executable on its command line. The "blocking"
 * parameter controls whether to block until the process terminates.
 *
 * Normally the process ID of the newly spawn process is returned. A negative return
 * value indicates an error condition:
 *    -1: the file does not exist
 *    -2: the file path points to a directory
 *    -3: other exceptions
 *
 * @public
 * @static
 * @function
 * @param {Object} nsFile         This is the executable file. It can be a string containing the file path or a file location reference
 * @param {String} aArgs          This is the array of arguments to pass to the executable
 * @param {Boolean} blocking      If "true", the method blocks until the process terminates; defaults to false
 * @return {Number}               The process ID
 */
GREUtils.File.run = function(nsFile, aArgs, blocking){
    var nsIFile = (typeof(nsFile) == "string") ? this.getFile(nsFile) : nsFile;
    if (nsIFile == null)
        return -1;
    if (nsIFile.isDirectory())
        return -2;

    var blocking = blocking || false;

    try {
        var process = GREUtils.XPCOM.createInstance("@mozilla.org/process/util;1", "nsIProcess");
        // var process = GREUtils.XPCOM.getService("@mozilla.org/process/util;1", "nsIProcess");

        process.init(nsIFile);

        var len = 0;
        if (aArgs)
            len = aArgs.length;
        else
            aArgs = null;
        rv = process.run(blocking, aArgs, len);
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.run: '+e.message);
        rv = -3
    }
    return rv;
};

/**
 * Spawns a new process to run an executable file.
 *
 * This method runs an executable file in a newly spawned process. The "aArgs" parameter
 * contains a array of arguments to pass to this executable on its command line. The "blocking"
 * parameter controls whether to block until the process terminates.
 *
 * @public
 * @static
 * @function
 * @param {Object} nsFile         This is the executable file. It can be a string containing the file path or a file location reference
 * @param {String} aArgs          This is the array of arguments to pass to the executable
 * @param {Boolean} blocking      If "true", the method blocks until the process terminates; defaults to false
 */
GREUtils.File.exec = function(){
    GREUtils.File.run.apply(this, arguments);
}

/**
 * Resolves a Chrome URL into a loadable URL using information in the Chrome registry.
 * Returns a string representation of the loadable URL if successful; otherwise null
 * is returned.
 *
 * @public
 * @static
 * @function
 * @param {String} chromePath     This is the chrome URL
 * @return {String} url           The loadable URL
 */
GREUtils.File.chromeToURL = function(chromePath){
    
    var uri = GREUtils.File.getURL(chromePath);
    var cr = GREUtils.XPCOM.getService("@mozilla.org/chrome/chrome-registry;1", "nsIChromeRegistry");
    var rv = null;
    try {
        var result = cr.convertChromeURL(uri);
        if (!GREUtils.isString(result)) {
            rv = cr.convertChromeURL(uri).spec;
        }
        else {
            rv = result;
        }
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.chromeToURL: '+e.message);
        rv = null;
    }
    return rv;
};

/**
 * Resolves a Chrome URL into a file path using information in the Chrome registry.
 * Returns null if resolution fails.
 *
 * @public
 * @static
 * @function
 * @param {String} chromePath     This is the chrome URL
 * @return {String} filepath      The file path
 */
GREUtils.File.chromeToPath = function(chromePath){
    
    var uri = GREUtils.File.getURL(chromePath);
    var cr = GREUtils.XPCOM.getService("@mozilla.org/chrome/chrome-registry;1", "nsIChromeRegistry");
    var rv = null;
    try {
        var result = cr.convertChromeURL(uri);
        if (!GREUtils.isString(result)) {
            result = cr.convertChromeURL(uri).spec;
        }

        if (!/^file:/.test(result))
            result = "file://" + result;

        var fph = GREUtils.XPCOM.getService("@mozilla.org/network/protocol;1?name=file", "nsIFileProtocolHandler");
        rv = fph.getFileFromURLSpec(result).path;

    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.chromeToPath: '+e.message);
        rv = null;
    }
    return rv;
};


/**
 * Resolves a file path into a loadable URL using local file path.<br/>
 * <br/>
 * Returns a string representation of the loadable URL if successful; otherwise
 * null is returned.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath           This is the file path
 * @return {String} url            The URL
 */
GREUtils.File.pathToURL = function(aPath){
    
      if (!aPath)
        return "";
    
      var rv;
      try {
        rv =GREUtils.XPCOM.createInstance("@mozilla.org/network/protocol;1?name=file",
                                     "nsIFileProtocolHandler").getURLSpecFromFile(GREUtils.File(aPath));
      } catch (e) { rv = ""; }

      return rv;
    
};

/**
 * Resolves a URL into a file path using file path.<br/>
 * <br/>
 * Returns null if resolution fails.
 *
 * @public
 * @static
 * @function
 * @param {String} aUrl           This is the URL
 * @return {String} path          The file path
 */
GREUtils.File.urlToPath = function(aUrl){
    
      if (!aUrl || !/^file:/.test(aPath))
        return "";
    
      var rv;
      try {

        rv = GREUtils.XPCOM.createInstance("@mozilla.org/network/protocol;1?name=file",
                                     "nsIFileProtocolHandler").getFileFromURLSpec(aUrl).path;

      } catch (e) { rv = ""; }

      return rv;
    
};


/**
 * Checks if a file exists.
 *
 * @public
 * @static
 * @function
 * @param {String} aFile          This is the file path
 * @return {Boolean}              "true" if the file exists; "false" otherwise
 */
GREUtils.File.exists = function(aFile){

    if (!aFile)
        return false;

    var rv;
    try {
        if (typeof aFile == "string") {
            rv = GREUtils.File.getFile(aFile, false, true).exists();
        }else if ( typeof aFile['exists'] == 'function'){
            rv = aFile.exists();
        }else {
            rv = false;
        }
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.exists: '+e.message);
        rv = false;
    }

    return rv;
};

/**
 * Removes a file.
 *
 * This method removes a file if it exists. Does not remove directories. Returns
 * "true" if the file is removed, "false" otherwise.
 *
 * @public
 * @static
 * @function
 * @param {String} aFile          This is the file path
 * @return {Boolean}              "true" if the file exists; "false" otherwise
 */
GREUtils.File.remove = function(aFile){

    if (!aFile)
        return false;

    var rv;
    var file;
    try {
        file = GREUtils.File.getFile(aFile);

        if (file.isDirectory())
            return false;

        file.remove(false);
        return true;


    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.remove: '+e.message);
        rv = false;
    }

    return rv;
};

/**
 * Copies a file to a new location.
 *
 * This method copies an existing file to a new location. If the new location is
 * a directory, that directory must already exist, and the file is copied into that
 * directory with the same file name.
 *
 * This method will not overwrite existing file; if a file already exists at the
 * new location then no copy takes place and the method returns "false".
 *
 * Returns "true" if the file is successfully copied, "false" otherwise.
 *
 * @public
 * @static
 * @function
 * @param {String} aSource        This is the file from which to copy
 * @param {String} aDest          This is the location to which to copy
 * @return {Boolean}              "true" if the copy succeeds; "false" otherwise
 */
GREUtils.File.copy = function(aSource, aDest){

    if (!aSource || !aDest)
        return false;

    if (!GREUtils.File.exists(aSource))
        return false;

    var rv;
    try {
        var fileInst = (typeof aSource == 'string') ? GREUtils.File.getFile(aSource) : aSource;
        var dir = (typeof aDest == 'string') ? GREUtils.File.getFile(aDest, false, true) : aDest ;
        var copyName = fileInst.leafName;

        if (fileInst.isDirectory())
            return false;

        if (!GREUtils.File.exists(aDest) || !dir.isDirectory()) {
            copyName = dir.leafName;
            dir = GREUtils.File.getFile(dir.path.replace(copyName, ''));

            if (!GREUtils.File.exists(dir.path))
                return false;

            if (!dir.isDirectory())
                return false;
        }

        if (GREUtils.File.exists(GREUtils.File.append(dir.path, copyName)))
            return false;

        fileInst.copyTo(dir, copyName);
        rv = true;
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.copy: '+e.message);
        return false;
    }

    return rv;
};

/**
 * Creates a new file path by appending a file name to a directory path and returns
 * that new file path.  Returns an empty string if the directory does not exist or
 * if the directory path given does not point to an actual directory.
 *
 * @public
 * @static
 * @function
 * @param {String} aDirPath       This is the directory path
 * @param {String} aFileName      This is the file name to append to the directory
 * @return {String} filePath      The new file path, empty if error
 */
GREUtils.File.append = function(aDirPath, aFileName){

    if (!aDirPath || !aFileName)
        return "";

    if (!GREUtils.File.exists(aDirPath))
        return "";

    var rv;
    try {
        var fileInst = GREUtils.File.getFile(aDirPath);
        if (fileInst.exists() && !fileInst.isDirectory())
            return "";

        fileInst.append(aFileName);
        rv = fileInst.path;
        delete fileInst;
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.append: '+e.message);
        return "";
    }

    return rv;
};


/**
 * Returns the Unix style permission bits of a file or directory. Returns 0 if the
 * file or directory does not exist.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {String}               The octal representation of the Unix style permission bits
 */
GREUtils.File.permissions = function(aPath){

    if (!aPath)
        return 0;

    if (!GREUtils.File.exists(aPath))
        return 0;

    var rv;
    try {
        rv = (GREUtils.File.getFile(aPath)).permissions.toString(8);
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.permissions: '+e.message);
        rv = 0;
    }

    return rv;

};

/**
 * Returns the modification date of a file or directory. Returns 0 if the file or
 * directory does not exist.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {String}               The modification date
 */
GREUtils.File.dateModified = function(aPath){

    if (!aPath) return null;

    if (!this.exists(aPath)) return null;

    var rv;
    try {
        rv = new Date((GREUtils.File.getFile(aPath)).lastModifiedTime).toLocaleString();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.dateModified: '+e.message);
        rv = null;
    }

    return rv;
};

/**
 * Returns the size of a file. Returns -1 if the file does not exist or if the
 * file size cannot be determined.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Number}               The file size
 */
GREUtils.File.size = function(aPath){

    if (!aPath)
        return -1;

    if (!GREUtils.File.exists(aPath))
        return -1;

    var rv = 0;
    try {
        rv = (GREUtils.File.getFile(aPath)).fileSize;
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.size: '+e.message);
        rv = -1;
    }

    return rv;
};

/**
 * Returns the extension of a file. Returns an empty string if the file does not exist
 * or if the file extension cannot be determined.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {String}               The file extension, empty if error.
 */
GREUtils.File.ext = function(aPath){

    if (!aPath)
        return "";

    if (!GREUtils.File.exists(aPath))
        return "";

    var rv;
    try {
        var leafName = (GREUtils.File.getFile(aPath)).leafName;
        var dotIndex = leafName.lastIndexOf('.');
        rv = (dotIndex >= 0) ? leafName.substring(dotIndex + 1) : "";
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.ext: '+e.message);
        return ""
    }

    return rv;
};

/**
 * Returns the parent path of a file path.
 *
 * If "aPath" is a file, this method returns the path of the directory containing the
 * file. If "aPath" is a directory, this method returns the path of the directory itself.
 *
 * Returns an empty string if "aPath" does not exist.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {String} filePath      The parent path, empty if error
 */
GREUtils.File.parent = function(aPath){
    if (!aPath)
        return "";

    var rv;
    try {
        var fileInst = GREUtils.File.getFile(aPath);

        if (!fileInst.exists())
            return "";

        if (fileInst.isFile())
            rv = fileInst.parent.path;

        else
        if (fileInst.isDirectory())
            rv = fileInst.path;

        else
            rv = "";
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.parent: '+e.message);
        rv = "";
    }

    return rv;
};


/**
 * Checks if a file path points to a directory.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is a directory; "false" otherwise
 */
GREUtils.File.isDir = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isDirectory();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isDir: '+e.message);
        rv = false;
    }
    return rv;
};

/**
 * Checks if a file path points to a regular file.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is a file; "false" otherwise
 */
GREUtils.File.isFile = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isFile();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isFile: '+e.message);
        rv = false;
    }
    return rv;
};

/**
 * Checks if a file is executable.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is an executable file; "false" otherwise
 */
GREUtils.File.isExecutable = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isExecutable();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isExecutable: '+e.message);
        rv = false;
    }
    return rv;

};


/**
 * Checks if a file path points to a symbolic link.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is a symbolic link; "false" otherwise
 */
GREUtils.File.isSymlink = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isSymlink();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isSymlink: '+e.message);
        rv = false;
    }
    return rv;

};

/**
 * Checks if a file or directory is writable by the user.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is writable; "false" otherwise
 */
GREUtils.File.isWritable = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isWritable();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isWritable: '+e.message);
        rv = false;
    }
    return rv;
};

/**
 * Checks if a file or directory is hidden.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is writable; "false" otherwise
 */
GREUtils.File.isHidden = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isHidden();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isHidden: '+e.message);
        rv = false;
    }
    return rv;

};


/**
 * Checks if a file or directory is readable.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the path is readable; "false" otherwise
 */
GREUtils.File.isReadable = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isReadable();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isReadable: '+e.message);
        rv = false;
    }
    return rv;

};


/**
 * Checks if a file path points to a special system file.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path
 * @return {Boolean}              "true" if the file is special; "false" otherwise
 */
GREUtils.File.isSpecial = function(aPath){

    var rv = false;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.isSpecial();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.isSpecial: '+e.message);
        rv = false;
    }
    return rv;

};

/**
 * Returns the canonical file path.
 *
 * Returns -1 if the file path does not exist or if read permission is denied for a
 * component of the path prefix.
 *
 * @public
 * @static
 * @function
 * @param {String} aPath          This is the file path to normalize
 * @return {String}               The normalized file path
 */
GREUtils.File.normalize = function(aPath){

    var rv;
    try {
        var fileInst = GREUtils.File.getFile(aPath);
        rv = fileInst.normalize();
    }
    catch (e) {
        GREUtils.log('[Error] GREUtils.File.normalize: '+e.message);
        rv = -1;
    }
    return rv;

};
