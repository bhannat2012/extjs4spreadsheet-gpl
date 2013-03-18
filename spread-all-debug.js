/**
 * @class Spread.selection.Range
 * Represents a set of Spread.selection.Position instances
 * and it's helper methods and attributes.
 */
Ext.define('Spread.selection.Range', {

    /**
     * @property {Array} positions
     * Selection positions
     */
    positions: [],

    // private constructor
    constructor: function(config) {

        // Apply the positions onto the instance
        Ext.apply(this, config);
    },

    /**
     * Calls the callback method for each position in the store
     * @param {Function} cb Callback called for each position. Arguments: position, index, length
     * @param {Function} [onComplete] Function that gets called when all interation processing is done
     * @return void
     */
    each: function(cb, onComplete) {
        var me = this;
        for (var i=0; i<me.positions.length; i++) {

            if (Ext.isFunction(cb)) {
                cb(me.positions[i], i, me.positions.length);
            }
        }

        if (Ext.isFunction(onComplete)) {
            onComplete();
        }
    },

    /**
     * Removes all positions from the range
     * @return void
     */
    removeAll: function() {
        this.positions = [];
    },

    /**
     * Adds a position to the range
     * @param {Spread.selection.Position} position Position instance
     * @return void
     */
    add: function(position) {
        this.positions.push(position);
    },

    /**
     * Selects all positions of this range
     * @param {Spread.selection.RangeModel} selModel Selection model reference
     * @param {Boolean} [virtual=false] Virtual selections do not update the view visually
     * @return void
     */
    select: function(selModel, virtual) {

        selModel.currentSelectionRange = this;

        if (!virtual) {
            selModel.view.highlightCells(this.positions);
        }
    },

    /**
     * Returns the count of positions stored inside this range
     * @return {Number}
     */
    count: function() {
        return this.positions.length;
    },

    /**
     * Returns all positions stored in this range as array
     * @return {Array}
     */
    toArray: function() {
        return this.positions;
    },

    /**
     * Returns the first position in the range
     * @return {Spread.selection.Position}
     */
    getFirst: function() {
        return this.positions[0];
    },

    /**
     * Returns the last position in the range
     * @return {Spread.selection.Position}
     */
    getLast: function() {
        return this.positions[this.positions.length-1];
    }
});
/**
 * Ext.spread.command.Commander
 * Class that implements a public command API for a more
 * simple usage of the spreads features.
 */
Ext.define('Spread.command.Commander', {

    requires: ['Spread.selection.Range'],

    /**
     * Selects a range
     * @return {Spread.selection.Range}
     */
    select: function() {

    }

    // TODO
});
/**
 * @class Spread.grid.Panel
 * @extends Ext.grid.Panel
 *
 * # Ext JS 4 SpreadSheet panels
 *
 * The grid panel class ist the most important class of Ext JS 4 Spreadsheet component.
 * You can configure all features of a Spreadsheet through the configuration of an instance of Spread.grid.Panel.
 *
 * ## A Simple Spreadsheet
 *
 * A very simple Spreadsheet example is:
 *
 * <code>
 *     // Creating an instance of the Spreadsheet's grid panel
 *     var spreadPanel = new Spread.grid.Panel({

         // Like all grids, a Spreadsheet grid also needs a store
         store: dataStore,

         // Configure visible grid columns
         columns: [{
             header: 'First name',
             dataIndex: 'firstname',

             // Lets disable selection for first column
             selectable: false
         }, {
             header: 'Last name',
             renderer: function(value) {
                 return '<b>' + value + '</b>';
             },
             dataIndex: 'lastname'
         }]
     });

 * </code>
 *
 * ## Anatomy of a Spreadsheet
 *
 * A Spreadsheet itself consists of three main classes:
 * <ul>
 *     <li>
 *         <u>The Panel:</u> <code>Spread.grid.Panel</code><br />
 *         <br />
 *         This is the master class of a Spreadsheet. All configuration belongs to this class.
 *         Except the View class, you don't need to know about the internals of the other classes
 *         nor their config options and events because every config option and every event is
 *         relayed to the grid panel class itself.<br />
 *         <br />
 *         Note: After instantiation of a grid, it's possible to access the View and Selection Model instances
 *         by calling <code>gridPanelInstance.getView()</code> and <code>gridPanelInstance.getSelectionModel()</code>.
 *         <br />
 *         <br />
 *         xtype: <code>spread</code>
 *         <br />
 *         <br />
 *     </li>
 *     <li>
 *         <u>The View:</u> <code>Spread.grid.View</code><br />
 *         <br />
 *         The view class extends a standard Ext.grid.View. It implements method to renders all spreadsheet-specific UI
 *         elements. It also handles all UI specific events for focusing and selecting cells.
 *
 *         The view of a Spreadsheet comes with it's own plugin architecture.
 *         Features like Spread.grid.plugin.Editable, Spread.grid.plugin.Copyable and Spread.grid.plugin.Pasteable
 *         are loosely coupled with the view instance itself. By default, you never need to care about them, because:
 *         <br />
 *         - All config options of the grid view are available via the grid panel's <code>viewConfig</code> object too<br />
 *         - All view class events are available through the grid panel class too
 *         <br />
 *         <br />
 *         xtype: <code>spreadview</code>
 *         <br />
 *         <br />
 *     </li>
 *     <li>
 *         <u>The Selection Model:</u> <code>Spread.selection.RangeModel</code><br />
 *         <br />
 *         The selection model implements all the logic (key/mouse navigation, key/mouse selection) required for
 *         making focusing and selection feels like using a native spreadsheet application.
 *
 *         By default, you never need to care about the selection model, because:<br />
 *         - All config options of this selection model are available through on the grid panel class too<br />
 *         - All selecton model events are available on the grid panel class too
 *         <br />
 *         <br />
 *         xtype: <code>range</code>
 *         <br />
 *         <br />
 *     </li>
 * </ul>
 *
 * ## Grid view customization
 *
 * Like in any standard Ext JS grid you can customize the configuration of the grid's view using the <code>viewConfig</code>
 * configuration option:
 *
 * <code>

       ...
       // A config, relayed to Spread.grid.View.
       // Shows
       viewConfig: {
           stripeRows: true
       },
      ...

   </code>
 *
 * ## Using the special header column <code>Spread.grid.column.Header</code>
 *
 * Next to all standard grid columns you can configure a spreadsheet to contain one or more spreadsheet header columns.
 * Header columns are non-selectable and non-editable and belong to the dataIndex 'id' by default.
 *
 * Like any other grid column, add the spreadheadercolumn instance configuration(s) to the Grid panel's column-configuration:
 *
 * <code>

       ...

       columns: [{
            xtype: 'spreadheadercolumn',
            header: 'ID',
            dataIndex: 'id' // default value
       }, ...],

       ...

   </code>
 *
 * <br />
 *
 * xtype: <code>spreadheadercolumn</code>
 *
 * ## Customizing grid cell selection: <code>Spread.selection.RangeModel</code>
 *
 * The special Range Selection Model that comes with Ext JS 4 SpreadSheet is the heart of the SpreadSheet implementation.
 * It implements the logic behind the native-like feeling when using the SpreadSheet grid. There are two configurations
 * possible then configuring the selection model:
 *
 * <ul>
 *     <li><code>autoFocusRootPosition</code> (default: true) &ndash; Automatically focuses the top- and -left-most cell which is selectable after view rendering</li>
 *     <li><code>enableKeyNav</code> (default: true) &ndash; En-/disabled the navigation using arrow keys, shift key + arrow keys</li>
 * </ul>
 *
 * You can simply set these both options on the grid panel instance.
 *
 * ### Disabling selection of cells of specific columns
 *
 * If you'd like to disable the cells of a column from being selected by the user, just set the <code>selectable</code> flag to <code>false</code>.
 *
   <code>
       ...
       columns: [{
           header: 'Firstname',
           dataIndex: 'firstname',
           selectable: false,
           ...
       }, ...],
       ...
   </code>
 *
 * <strong>Note: Instead of header columns, all columns in a spreadsheet grid are selectable by  because of <code>Spread.grid.overrides.Column</code>.</strong>
 *
 * <br />
 *
 * xtype: <code>range</code>
 *
 * ## Editing of cells data using <code>Spread.grid.plugin.Editing</code>
 *
 * Cells of Ext JS 4 SpreadSheet can be edited like a standard Ext JS 4 grid. To gain a look and feel like using a
 * native spreadsheet application, there is a special plaintext editor getting active when start typing or double-clicking
 * on a grid cell. <strong>There is currently no support for Ext JS editor fields</strong> for the gain of being consistent
 * with the native spreadsheet look & feel.
 *
 * ### En-/disabling grid cell editing of the whole grid
 *
 * You can enable or disable grid editing on configuration time by setting the <code>editable</code> config option:
 *
 * <code>
       ...
       editable: false,
       ...
   </code>
 *
 * After instantiation (at runtime), you can access the SpreadSheet grid panel instance (e.g. using <code>Ext.getCmp(...)</code>)
 * and call the method <code>setEditable((Boolean) isEditable)</code> to en-/disable editing at runtime:
 *
 * <code>

       Ext.getCmp('$gridPanelId').setEditable(false);

   </code>
 *
 * <strong>Note: Disabling editing mode globally means that editing gets disabled on all columns, ignoring what you
 * configured for the columns before. Enabling edit mode globally means that editing gets enabled only on those
 * columns, editing was enabled by configuration.</strong>
 *
 * ### Disabling editing of cells of specific columns
 *
 * If you'd like to disable editing of cell data for a column, just set the <code>editable</code> flag to <code>false</code>.
 *
   <code>
       ...
       columns: [{
           header: 'Firstname',
           dataIndex: 'firstname',
           editable: false,
           ...
       }, ...],
       ...
   </code>
 *
 * <strong>Note: Instead of header columns, all columns in a spreadsheet grid are editable by default because of <code>Spread.grid.overrides.Column</code>.</strong>
 *
 * ### Colorization of editable cells
 *
 * Ext JS 4 SpreadSheet has a special feature to colorize the cell background of cells, which are editable.
 * By default this color is light yellow (see "Special Styling (CSS)" section if you'd like to change this).
 * You can en-/disable this feature by setting the <code>enableEditModeStyling</code> config
 * option in grid panel configuration:
 *
 * <code>
       ...
       enableEditModeStyling: true, // default value
       ...
   </code>
 *
 * <strong>Note that <code>editModeStyling</code> can cause problems when using special cell background colors.</strong>
 *
 * ### Advanced editing configuration
 *
 * The editing plugin features several configuration options. If you'd like to change the editing behaviour, instantiate
 * the grid panel with <strong>a configured instance</strong> of <code>Spread.grid.plugin.Editing</code> like shown below:
 *
 * <code>

       ...

       editablePluginInstance: Ext.create('Spread.grid.plugin.Editable', {
           editModeStyling: false, // disallows edit mode styling even if activated on columns
           ...
       }),

       ...

   </code>
 *
 * ## Cell data pre-processor functions
 *
 * Every column in a spreadsheet grid panel can be configured to use a custom getter and setter function
 * to read data from the record to be displayed or copied (reader function) or to pre-process pasted data
 * or edited values before getting written to a data record (writer function).
 *
 * ### Column based cell reader function
 *
 * Registering a cell data reader hook is easy. Simply set the <code>cellreader</code> property to a function:
 *
 * <code>
       ...
       columns: [{
           header: 'Firstname',
           dataIndex: 'firstname',
           cellreader: function(value, position) {
               // transform cell data value here...
               return value;
           }
           ...
       }, ...],
       ...
   </code>
 *
 * As you can see, the reader function gets called with two arguments:
 *
 * <ul>
 *     <li> <code>value</code> &ndash; The data value read from cell data record field</li>
 *     <li> <code>position Spread.selection.Position</code> &ndash; The cell's position</li>
 * </ul>
 *
 * <strong>The return value will be used for rendering cell data, value to be used in cell editor, copying cell data.</strong>
 *
 * ### Column based cell writer function
 *
 * If you configure a <code>cellwriter</code>-function for a column, the data which gets pasted or
 * submitted after leaving the edit mode (the text input field) of a cell, will be processed by this function.
 *
 * The first argument contains the new value (String). The second argument holds a reference to the current
 * focused cell position (Spread.selection.Position). The value you return in the <code>cellwriter</code> function
 * is the value which gets written onto the data record.
 *
 * Simply set the <code>cellwriter</code> property to a function:
 *
 * <code>
       ...
       columns: [{
           header: 'Firstname',
           dataIndex: 'firstname',
           cellwriter: function(newValue, position) {
               // pre-process new cell data value here before it's getting written to the data record...
               return newValue;
           }
           ...
       }, ...],
       ...
   </code>
 *
 * Attention: If you DONT SET a cellwriter, the spreadsheet tries to automatically cast the datatype
 * of the incoming new value (String) into the data type defined in the model (type) - e.g. int -> parseInt,
 * float -> parseFloat and so on. If you do not set a data type in the model or set the
 * data type to 'auto' String values will be stored. Have a look at Spread.selection.Position#setValue for details.
 *
 * As you can see, the writer function gets called with two arguments:
 *
 * <ul>
 *     <li> <code>newValue</code> &ndash; The data value to be written to the cell data record field</li>
 *     <li> <code>position Spread.selection.Position</code> &ndash; The cell's position</li>
 * </ul>
 *
 * <strong>The return value will be used to be written to the data record.
 * The new value may be supplied by pasting data into the cell or field editor.</strong>
 *
 * ## Auto-Committing of cell data on edit/paste
 *
 * When cell data gets changed by editing or pasting data the underlaying grid row's store record can be automatically
 * changed when auto-committing is enabled on the column and the grid panel. This prevents the red arrow dirty marker
 * from being displayed.
 *
 * Auto-committing of cell data is disabled by default on the grid panel but enabled on each grid column by default.
 * This means that you can enable auto-committing easily and globally by setting the <code>autoCommit</code> config
 * option to <code>true</code> on the grid panel instance:
 *
 * <code>

       ...,
       autoCommit: true,
       ...

   </code>
 *
 * ### Disabling auto committing for specific columns
 *
 * To disable auto committing of cell data on the cells of specific columns simply set the <code>autoCommit</code> config
 * option of a grid column to <code>false</code>:
 *
 * <code>
       ...,
       columns: [{
           header: 'Lastname',
           dataIndex: 'lastname',
           autoCommit: false
       }, ...],
       ...
   </code>
 *
 * ## Advanced: Event capturing
 *
 * In some special cases you may want to capture spreadsheet grid events to execute custom application code when needed.
 * E.g. you want to execute special logic when a cell gets covered (selection of a cell happened and covering view element
 * has been rendered and placed over the specific cell).
 *
 * For such purpose you may simply add an event listener to the specific grid event using the <code>listeners</code>
 * configuration option, bind an event handler to the instance using Ext.getCmp(...).on('covercell', function() {...})
 * or use the MVC's controller infrastructure to select a component and bind it's events:
 *
   <code>
       ...
       listeners: {

           // Simple listening to a View's event (relayed)
           covercell: function() {
               console.log('External listener to covercell', arguments);
           }
       },
       ...
   </code>
 *
 * <strong> Note that any special spreadsheet event fired by sub-components of the grid panel: the grid's view,
 * editable, pasteable and copyable plugin get relayed to the grid panel itself. So you don't need to care about these
 * sub-component instances for event handling.
 *
 * To capture selection model events, call <code>grid.getSelectionModel().on('$selectionModelEventName', function() {...})</code>.
 * </strong>
 *
 * ## Advanced: Custom styling
 *
 * Customizing the look of the spreadsheet grid can be accomplished by changing configuration options of the <code>viewConfig</code>
 * configuration option (see above). But if that doesn't help you may want to override CSS rules to e.g. change the color of the
 * background color when <code>editModeStyling</code> is enabled. Therefore you would just need to include your own
 * CSS stylesheet file or append a <code>style</code>-tag to the <code>head</code>-section of your web page containing something like this:
 *
 * <code>

     .x-grid-row .spreadsheet-cell-editable .x-grid-cell-inner {
         background-color: #cfffff;
     }

     .x-grid-row .spreadsheet-cell-editable-dirty .x-grid-cell-inner {
         background-color: #cfffff;
         background-image: url("dirty.gif");
         background-position: 0 0;
         background-repeat: no-repeat;
     }

   </code>
 *
 * <strong>Just copy and paste the CSS selectors of resources/spread.css to change the style of your spreadsheet grid.
 * Ensure to prepend your own styling rules.</strong>
 *
 * ## Advanced: Special copy & paste behaviour customization
 *
 * For fine tuning and in special cases you may want to change the default configuration of the pasteable and copyable
 * plugins of the spreadsheet grid panel. Thanks to the dependency injection architecture of the spreadsheet grid
 * implementation you can simply create your own plugin instance and inject it into the spreadsheet grid panel instance
 * configuration:
 *
 * <code>

       ...

       copyablePluginInstance: Ext.create('Spread.grid.plugin.Copyable', {

           // Overriding a method on instance level to change the keystroke for copying.
           // Using this it's CTRL+O instead of C but only for this instance of the spreadsheet gird.
           detectCopyKeyStroke: function(evt) {

              if (evt.getKey() === evt.O && evt.ctrlKey) {
                  this.copyToClipboard();
              }
          },
           ...
       }),

       pasteablePluginInstance: Ext.create('Spread.grid.plugin.Pasteable', {
           useInternalAPIs: true, // Enabling an experimental feature, much faster but dangerous
           ...
       }),

       ...

   </code>
 */
Ext.define('Spread.grid.Panel', {

    extend: 'Ext.grid.Panel',

    requires: ['Spread.command.Commander'],

    alias: 'widget.spread',

    // use spread view
    viewType: 'spreadview',

    closeAction: 'destroy',

    /**
     * @cfg {Boolean} autoFocusRootPosition
     * Automatically focuses the root position initially
     */
    autoFocusRootPosition: true,

    /**
     * @cfg {Boolean} enableKeyNav
     * Turns on/off keyboard navigation within the grid.
     */
    enableKeyNav: true,

    /**
     * @cfg {Boolean} editable
     * Configures if the grid is in edit mode initially
     */
    editable: true,

    /**
     * @cfg {Boolean} autoCommit
     * Automatically commit changed records or wait for manually store.sync() / record.commit()?
     * (Generally, can be specially configured per column config too)
     */
    autoCommit: false,

    /**
     * @cfg {Boolean} editModeStyling
     * Allows to style the cells when in edit mode
     */
    editModeStyling: true,

    // Show column lines by default
    columnLines: true,

    // Internal flag
    //stripeRows: false,

    /**
     * @cfg {Object}
     * Config object to configure a Spread.grid.plugin.Editable plugin.
     * To change the configuration of the plugin, you may just assign your own config here.
     */
    editablePluginConfig: {},

    /**
     * @cfg {Object}
     * Config object to configure a Spread.grid.plugin.Copyable plugin.
     * To change the configuration of the plugin, you may just assign your own config here.
     */
    copyablePluginConfig: {},

    /**
     * @cfg {Object}
     * Config object to configure a Spread.grid.plugin.Pasteable plugin.
     * To change the configuration of the plugin, you may just assign your own config here.
     */
    pasteablePluginConfig: {},

    /**
     * @cfg {Object}
     * Config object to configure a Spread.grid.plugin.ClearRange plugin.
     * To change the configuration of the plugin, you may just assign your own config here.
     */
    clearRangePluginConfig: {},

    /**
     * Pre-process the column configuration to avoid incompatibilities
     * @return void
     */
    constructor: function(config) {

        var me = this;

        // Create instances of plugins
        this.instantiatePlugins();

        // Add events
        this.addEvents(

            /**
             * @event beforecovercell
             * @inheritdoc Spread.grid.View#beforecovercell
             */
            'beforecovercell',

            /**
             * @event covercell
             * @inheritdoc Spread.grid.View#covercell
             */
            'covercell',

            /**
             * @event beforehighlightcells
             * @inheritdoc Spread.grid.View#beforehighlightcells
             */
            'beforehighlightcells',

            /**
             * @event beforehighlightcells
             * @inheritdoc Spread.grid.View#beforehighlightcells
             */
            'highlightcells',

            /**
             * @event beforeeditfieldblur
             * @inheritdoc Spread.grid.View#beforeeditfieldblur
             */
            'beforeeditfieldblur',

            /**
             * @event editfieldblur
             * @inheritdoc Spread.grid.View#editfieldblur
             */
            'editfieldblur',

            /**
             * @event beforecoverdblclick
             * @inheritdoc Spread.grid.View#beforecoverdblclick
             */
            'beforecoverdblclick',

            /**
             * @event coverdblclick
             * @inheritdoc Spread.grid.View#coverdblclick
             */
            'coverdblclick',

            /**
             * @event beforecoverkeypressed
             * @inheritdoc Spread.grid.View#beforecoverkeypressed
             */
            'beforecoverkeypressed',

            /**
             * @event coverkeypressed
             * @inheritdoc Spread.grid.View#coverkeypressed
             */
            'coverkeypressed',

            /**
             * @event beforeeditingenabled
             * @inheritdoc Spread.grid.View#beforeeditingenabled
             */
            'beforeeditingenabled',

            /**
             * @event editingenabled
             * @inheritdoc Spread.grid.View#editingenabled
             */
            'editingenabled',

            /**
             * @event beforeeditingdisabled
             * @inheritdoc Spread.grid.View#beforeeditingdisabled
             */
            'beforeeditingdisabled',

            /**
             * @event editingdisabled
             * @inheritdoc Spread.grid.View#editingdisabled
             */
            'editingdisabled',

            /**
             * @event covercelleditable
             * Fires after a cell got covered for editing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             * @param {Spread.grid.View} view Spread view instance
             * @param {Spread.selection.Position} position Position to be covered
             * @param {Ext.dom.Element} coverEl Cover element
             */
            'covercelleditable',

            /**
             * @event editablechange
             * Fires after the editable flag has changed and all re-rendering has been done.
             * Use this event if you e.g. want to reload the store "directly" after calling setEditable() etc.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             * @param {Boolean} isEditable Indicator if the spread is now editable or not
             */
            'editablechange',

            /**
             * @event beforecopy
             * @inheritdoc Spread.grid.View#beforecopy
             */
            'beforecopy',

            /**
             * @event copy
             * @inheritdoc Spread.grid.View#copy
             */
            'copy',

            /**
             * @event beforepaste
             * @inheritdoc Spread.grid.View#beforepaste
             */
            'beforepaste',

            /**
             * @event paste
             * @inheritdoc Spread.grid.View#paste
             */
            'paste'
        );

        // Manage the view config instance configuration
        me.manageViewConfig(config);

        // Manage the selection model instance configuration
        me.manageSelectionModelConfig(config);

        me.callParent(arguments);

        // Relay events of view
        me.relayEvents(me.getView(), [
            'beforecovercell',
            'covercell',
            'beforehighlightcells',
            'highlightcells',
            'beforeeditfieldblur',
            'editfieldblur',
            'beforecoverdblclick',
            'coverdblclick',
            'beforecoverkeypressed',
            'coverkeypressed',
            'beforeeditingenabled',
            'editingenabled',
            'beforeeditingdisabled',
            'editingdisabled',
            'beforecopy',
            'copy',
            'beforepaste',
            'paste',
            'editablechange',
            'covercelleditable'
        ]);

        // Just relay autoCommit flag to pastable plugin
        if (me.pasteablePluginInstance) {
            me.pasteablePluginInstance.autoCommit = me.autoCommit;
        }

        //console.log('my view', me.view);

        // View refresh
        me.editablePluginInstance.on('covercelleditable', function() {

            // Handle edit mode initially
            me.setEditable(me.editable);

            // Set edit mode styling
            me.setEditModeStyling(me.editModeStyling);

        }, this, {
            single: true
        });
    },

    /**
     * @protected
     * Initialize the columns before rendering them
     */
    initComponent: function() {

        //console.log('cols? ', this.columns);

        // Initialize columns
        this.initColumns();

        return this.callParent(arguments);
    },

    /**
     * Returns the Commander API
     * @return {Spread.command.Commander}
     */
    getCommander: function() {

        // Create and return an instance of the commander
        return Ext.create('Spread.command.Commander', {
            grid: this
        });
    },

    /**
     * @protected
     * Initializes the columns by referencing the view onto them
     * @return void
     */
    initColumns: function() {

        //console.log('gridColumns', this.columns);

        // Assign the plugin to the columns too
        for (var j=0; j<this.columns.length; j++) {

            // Reference the view on each column
            this.columns[j].view = this;
        }
    },

    /**
     * @protected
     * Creates instances of plugins from local configuration
     * @return void
     */
    instantiatePlugins: function() {

        this.editablePluginInstance = Ext.create('Spread.grid.plugin.Editable', this.editablePluginConfig);
        this.copyablePluginInstance = Ext.create('Spread.grid.plugin.Copyable', this.copyablePluginConfig);
        this.pasteablePluginInstance = Ext.create('Spread.grid.plugin.Pasteable', this.pasteablePluginConfig);
        this.clearRangePluginInstance = Ext.create('Spread.grid.plugin.ClearRange', this.clearRangePluginConfig);
    },

    /**
     * @protected
     * Pays attention to the fact that the developer could define an own viewConfig,
     * so we need to merge-in our spreadPlugins array (apply the defaults)
     * @param {Object} config Grid config object
     * @return void
     */
    manageViewConfig: function(config) {

        this.hasView = false;

        var me = this, initSpreadPlugins = function(config) {

            // Init plugins array
            config.viewConfig.spreadPlugins = [];

            // Add default plugins
            config.viewConfig.spreadPlugins.push(
                me.editablePluginInstance,
                me.copyablePluginInstance,
                me.pasteablePluginInstance,
                me.clearRangePluginInstance
            );
        };

        // User specified it's on viewConfig
        if (config.viewConfig) {

            // Maintain merging of spreaiewonfig section
            if (config.viewConfig.spreadPlugins && Ext.isArray(config.viewConfig.spreadPlugins)) {

                // Merges a plugin into spreadPlugins array if forgotten to be defined
                var pluginCheckMerge = function(classRef, pluginConfig) {

                    var pluginFound = false;

                    // Search for configured plugin
                    for (var i=0; i<config.viewConfig.spreadPlugins.length; i++) {
                        if (config.viewConfig.spreadPlugins[i] instanceof classRef) {
                            pluginFound = true;
                        }
                    }

                    if (!pluginFound) {
                        config.viewConfig.spreadPlugins.push(pluginConfig);
                    }
                };

                // Add plugins, forgotten by developer
                pluginCheckMerge(Spread.grid.plugin.Editable, this.editablePluginInstance);
                pluginCheckMerge(Spread.grid.plugin.Copyable, this.copyablePluginInstance);
                pluginCheckMerge(Spread.grid.plugin.Pasteable, this.pasteablePluginInstance);
                pluginCheckMerge(Spread.grid.plugin.ClearRange, this.clearRangePluginInstance);

            } else {

                // Initialize
                initSpreadPlugins(config);
            }

            // Lazy apply stripeRows config
            if (Ext.isDefined(config.viewConfig.stripeRows)) {
                config.viewConfig.stripeRows = config.viewConfig.stripeRows;
            } else {
                config.viewConfig.stripeRows = this.stripeRows;
            }

        } else {

            // Init the view config object
            config.viewConfig = {};

            // Initialize
            initSpreadPlugins(config);
        }

        // console.log('viewConfig', config.viewConfig);
    },

    /**
     * @protected
     * Simply merges the selection model specific options into the selModel configuration dynamically.
     * @param {Object} config Grid config object
     * @return void
     */
    manageSelectionModelConfig: function(config) {

        var selModelConfig = {
            selType: 'range'
        };

        // Apply autoFocusRootPosition
        if (Ext.isDefined(config.autoFocusRootPosition)) {
            selModelConfig.autoFocusRootPosition = config.autoFocusRootPosition;
        } else {
            selModelConfig.autoFocusRootPosition = this.autoFocusRootPosition;
        }

        // Apply enableKeyNav
        if (Ext.isDefined(config.enableKeyNav)) {
            selModelConfig.enableKeyNav = config.enableKeyNav;
        } else {
            selModelConfig.enableKeyNav = this.enableKeyNav;
        }

        //console.log('selModelConfig', selModelConfig);

        // Assign selection model instance
        this.selModel = selModelConfig;
    },

    /**
     * Enables/Disables editing grid-wide (overriding the column configuration at runtime)
     * @param {Boolean} allowEditing Is editing allowed?
     * @return void
     */
    setEditable: function(allowEditing) {

        // Set internal flag
        this.editable = allowEditing;

        // Call the editable plugin to handle edit mode switch
        if (this.getView().editable && this.getView().editable.setDisabled) {

            // Set editable disabled on plugin instance
            this.getView().editable.setDisabled(this.editable);

            // Set autoCommit flag
            this.getView().editable.autoCommit = this.autoCommit;

        } else {
            throw "You want the grid to be editable, but editing plugin isn't activated!";
        }
    },

    /**
     * Enables/Disables the edit mode styling on the whole grid
     * @param {Boolean} editModeStyling Allow edit mode styling?
     * @return void
     */
    setEditModeStyling: function(editModeStyling) {

        // Set internal flag
        this.editModeStyling = editModeStyling;

        // Call the editable plugin to handle edit mode style switch
        if (this.getView().editable && this.getView().editable.displayCellsEditing) {

            // Set flag
            this.getView().editable.editModeStyling = this.editModeStyling;

            // Re-render cells
            if (this.editModeStyling && this.editable) {

                // Render editable and styled
                this.getView().editable.displayCellsEditing(true);

            } else {

                // Render un-styled
                this.getView().editable.displayCellsEditing(false);
            }


        } else {
            throw "You want the grid to change it's edit mode styling, but editing plugin isn't activated!";
        }
    },

    /**
     * Returns true if grid is in edit mode
     * @return {Boolean}
     */
    isEditable: function() {
        return this.editable;
    }
});
/**
 * @class Spread.grid.View
 *
 * The Spread view class extends the Ext.grid.View by implementing UI features like
 * covering cells with a border-marker (known from spreadsheet applications) and cell
 * selection background color change.
 *
 * <b>Please use the Grid's viewConfig-property for configuration of the view.</b>
 */
Ext.define('Spread.grid.View', {

    extend: 'Ext.grid.View',

    alias: 'widget.spreadview',

    /**
     * @cfg {Boolean} autoFocus
     * Automatically focus spread view for direct key eventing/navigation after render
     */
    autoFocus: true,

    /**
     * @cfg {Number} autoFocusDelay
     * Auto focus delay in ms
     */
    autoFocusDelay: 50,

    /**
     * @cfg {Number} cellFocusDelay
     * Cell (re-)focus delay in ms
     */
    cellFocusDelay: 30,

    // Deactivate trackOver and row striping by default
    stripeRows: false,
    trackOver: false,

    spreadViewBaseCls: 'spreadsheet-view',

    // Internal cell cover element reference
    cellCoverEl: null,

    // Internal reference to the current cover position
    currentCoverPosition: null,

    // Array of positions currently highlighted
    currentHighlightPositions: [],

    // Internal flag
    dataChangedRecently: true,

    /**
     * @cfg {Number} cellCoverZIndex
     * Value of zIndex for cell covers
     */
    cellCoverZIndex: 2,

    /**
     * @cfg {Number} selectionCoverZIndex
     * Value of zIndex for selection covers
     */
    selectionCoverZIndex: 1,

    /**
     * @cfg {Number} coverPositionTopSubstract
     * Value to substract pixels from cover positioning (placing cover out of inner cell box)
     */
    coverPositionTopSubstract: 2,

    /**
     * @cfg {Number} coverPositionLeftSubstract
     * Value to substract pixels from cover positioning (placing cover out of inner cell box)
     */
    coverPositionLeftSubstract: 2,

    /**
     * @cfg {Number} coverWidthAddition
     * Value to add pixels to cover size (width)
     */
    coverWidthAddition: 3,

    /**
     * @cfg {Number} coverHeightAddition
     * Value to add pixels to cover size (height)
     */
    coverHeightAddition: 3,

    /**
     * @private
     */
    initComponent: function() {

        // Disable row-striping
        this.stripeRows = false;

        // Add spread view CSS cls
        this.baseCls = this.baseCls + ' ' + this.spreadViewBaseCls;

        // Add events
        this.addEvents(

            /**
             * @event beforecovercell
             * Fires before a cell gets covered visually. Return false in listener to stop the event processing.
             * @param {Spread.grid.View} view Spread view instance
             * @param {Spread.selection.Position} position Position to be covered
             * @param {Ext.dom.Element} coverEl Cover element
             */
            'beforecovercell',

            /**
             * @event covercell
             * Fires when a cell got covered visually.
             * @param {Spread.grid.View} view Spread view instance
             * @param {Spread.selection.Position} position Position to be covered
             * @param {Ext.dom.Element} coverEl Cover element
             */
            'covercell',

            /**
             * @event beforehighlightcells
             * Fires before a range of cells get highlighted visually. Return false in listener to stop the event processing.
             * @param {Spread.grid.View} view Spread view instance
             * @param {Array} positions Array of selection positions identifying cells
             */
            'beforehighlightcells',

            /**
             * @event beforehighlightcells
             * Fires when a range of cells got highlighted visually.
             * @param {Spread.grid.View} view Spread view instance
             * @param {Array} positions Array of selection positions identifying cells
             */
            'highlightcells',

            /**
             * @event beforeeditfieldblur
             * @inheritdoc Spread.grid.plugin.Editable#beforeeditfieldblur
             */
            'beforeeditfieldblur',

            /**
             * @event editfieldblur
             * @inheritdoc Spread.grid.plugin.Editable#editfieldblur
             */
            'editfieldblur',

            /**
             * @event beforecoverdblclick
             * @inheritdoc Spread.grid.plugin.Editable#beforecoverdblclick
             */
            'beforecoverdblclick',

            /**
             * @event coverdblclick
             * @inheritdoc Spread.grid.plugin.Editable#coverdblclick
             */
            'coverdblclick',

            /**
             * @event beforecoverkeypressed
             * @inheritdoc Spread.grid.plugin.Editable#beforecoverkeypressed
             */
            'beforecoverkeypressed',

            /**
             * @event coverkeypressed
             * @inheritdoc Spread.grid.plugin.Editable#coverkeypressed
             */
            'coverkeypressed',

            /**
             * @event beforeeditingenabled
             * @inheritdoc Spread.grid.plugin.Editable#beforeeditingenabled
             */
            'beforeeditingenabled',

            /**
             * @event editingenabled
             * @inheritdoc Spread.grid.plugin.Editable#editingenabled
             */
            'editingenabled',

            /**
             * @event beforeeditingdisabled
             * @inheritdoc Spread.grid.plugin.Editable#beforeeditingdisabled
             */
            'beforeeditingdisabled',

            /**
             * @event editingdisabled
             * @inheritdoc Spread.grid.plugin.Editable#editingdisabled
             */
            'editingdisabled',

            /**
             * @event beforecopy
             * @inheritdoc Spread.grid.plugin.Copyable#beforecopy
             */
            'beforecopy',

            /**
             * @event copy
             * @inheritdoc Spread.grid.plugin.Copyable#copy
             */
            'copy',

            /**
             * @event beforepaste
             * @inheritdoc Spread.grid.plugin.Pasteable#beforepaste
             */
            'beforepaste',

            /**
             * @event paste
             * @inheritdoc Spread.grid.plugin.Pasteable#paste
             */
            'paste'
        );


        // Call parent
        var ret = this.callParent(arguments);

        //console.log('SpreadPlugins', this.spreadPlugins);

        // Create cover element if not already existing
        if (!this.cellCoverEl) {
            this.createCellCoverElement();
        }

        // Initialize view plugins
        this.initPlugins(this.spreadPlugins);

        // Initializes relay eventing
        this.initRelayEvents();

        return ret;
    },

    /**
     * @protected
     * Register relayed events
     * @return void
     */
    initRelayEvents: function() {

        // Relay editable plugin events
        this.relayEvents(this.editable, [
            'beforeeditfieldblur',
            'editfieldblur',
            'beforecoverdblclick',
            'coverdblclick',
            'beforecoverkeypressed',
            'coverkeypressed',
            'beforeeditingenabled',
            'editingenabled',
            'beforeeditingdisabled',
            'editingdisabled',
            'editablechange',
            'covercelleditable'
        ]);

        // Relay copyable plugin events
        this.relayEvents(this.copyable, [
            'beforecopy',
            'copy'
        ]);

        // Relay pasteable plugin events
        this.relayEvents(this.pasteable, [
            'beforepaste',
            'paste'
        ]);
    },

    /**
     * @protected
     * Initializes view plugins
     * @param {Array} plugins View plugins
     * @return void
     */
    initPlugins: function(plugins) {

        for (var i=0; i<plugins.length; i++) {

            // Reference the plugin
            this[plugins[i].alias] = plugins[i];

            // Initialize the plugin
            this[plugins[i].alias].init(this);
        }
    },

    /**
     * @protected
     * Creates the cell cover element used to cover a cell on focus
     * @return void
     */
    createCellCoverElement: function() {

        var me = this;

        this.on('afterrender', function() {

            // Tab eventing
            this.getEl().set({
                tabIndex: 0
            });

            // Focus view element if configured
            if (me.autoFocus) {

                setTimeout(function() {
                    try {
                        me.getEl().focus();
                    } catch(e) {}

                }, me.autoFocusDelay);
            }

            // Generate cell cover element
            this.cellCoverEl = Ext.DomHelper.append(this.getEl(), {
                tag: 'div',
                id: 'cover-el' + Ext.id(),
                cls: 'spreadsheet-cell-cover'
            });

            // Register a mousedown listener to let all mousedown events bubble to the cell (<td>) covering
            Ext.get(this.cellCoverEl).on('mousedown', this.bubbleCellMouseDownToSelectionModel, this);

            // Always resize cell cover on column resize
            this.headerCt.on('columnresize', function() {

                // Re-cover the cell covering
                this.coverCell();

            }, this);

        }, this);
    },

    /**
     * @protected
     * Bubble the mousedown event to the cell's <td> element which is covered by the coverEl.
     * @param {Ext.EventObject} evt Event of mousedown
     * @param {HTMLElement} coverEl Promise that this is a cover element, the user clicked on
     * @return void
     */
    bubbleCellMouseDownToSelectionModel: function(evt, coverEl) {

        var cellEl = coverEl.id.split('_'),
            rowEl, tableBodyEl, rowIndex, cellIndex, record;

        // Fetch <td> cell for given cover element and proove that
        if (cellEl[1] && Ext.fly(cellEl[1]) && Ext.fly(cellEl[1]).hasCls('x-grid-cell')) {

            // Cell <td> element
            cellEl = Ext.fly(cellEl[1]).dom;

            // Row <tr> element
            rowEl = Ext.fly(cellEl).up('tr').dom;

            // Fetch record with using node info
            record = this.getRecord(rowEl);

            // Table <table> element
            tableBodyEl = Ext.fly(rowEl).up('tbody').dom;

            // Analyze cell index
            for (var i=0; i<rowEl.childNodes.length; i++) {
                if (rowEl.childNodes[i] === cellEl) {
                    cellIndex = i;
                    break;
                }
            }

            // Analyze row index
            for (var i=0; i<tableBodyEl.childNodes.length; i++) {
                if (tableBodyEl.childNodes[i] === rowEl) {
                    rowIndex = (i-1);
                    break;
                }
            }

            // Bubble the event through
            this.getSelectionModel().onCellMouseDown('mousedown', this, cellEl, rowIndex, cellIndex, evt, record, rowEl);
        }
    },

    /**
     * Implements a re-styling of the view after refreshing when edit mode is enabled
     * @return {*}
     */
    refresh: function() {

        var ret = this.callParent(arguments);

        //console.log('refresh?!')

        if (this.dataChangedRecently) {
            this.dataChangedRecently = false;
            return ret;
        } else {

            if (this.editable) {

                this.editable.displayCellsEditing(
                    this.editable.editModeStyling && this.editable.editable
                );
            }
        }
        return ret;
    },

    /**
     * Initially shows/Updates the cell cover to cover a new position.
     * Sets the this.currentCoverPosition if a position is given (initial showing)
     * OR uses the current/already focussed cover position (update mode).
     * @param {Spread.selection.Position} [position=this.currentCoverPosition] Position object reference
     * @return void
     */
    coverCell: function(position) {

        //console.log('coverCell', position);

        var me = this,
            coverEl = me.getCellCoverEl();

        // Do await event processing, a listener returning false may stop covering the cell
        if (me.fireEvent('beforecovercell', me, position, coverEl) !== false) {

            // Remove highlighting if new position is given
            if (position) {
                me.highlightCells();
            }

            // Auto-detect if not given (update mode)
            if (!position) {
                position = me.currentCoverPosition;
            } else {
                me.currentCoverPosition = position;
            }

            // Update position
            position.validate();

            var tdEl = Ext.get(position.cellEl),
                coverElSize, coverElPosition;

            // Show cover
            coverEl.setStyle('display', 'block');

            // Position calc
            coverElPosition = tdEl.getXY();
            coverElPosition[0] -= me.coverPositionTopSubstract;
            coverElPosition[1] -= me.coverPositionLeftSubstract;

            // Move cover in front of td (x, y)
            coverEl.setXY(coverElPosition);

            // Set in zIndex in front of td (z)
            coverEl.setStyle('z-index', me.cellCoverZIndex);

            // Size calc
            coverElSize = tdEl.getSize();
            coverElSize.width += me.coverWidthAddition;
            coverElSize.height += me.coverHeightAddition;

            // Set size
            coverEl.setSize(coverElSize);

            // Set cover id
            coverEl.dom.id = 'coverOf_' + tdEl.dom.id;

            // After a small timeout, focus cell (may scroll into view)
            setTimeout(function() {

                // Scroll view into cover position
                me.focusCell(position);

                // Re-focus on view, because focusCell() focus()'es cell <td> element
                try {
                    me.getEl().focus();
                } catch (e) {}

            }, me.cellFocusDelay);

            // Fire event
            me.fireEvent('covercell', me, position, coverEl, tdEl, coverElSize, coverElPosition);
        }
    },

    /**
     * Highlights a range of cells identified by Spread.selection.Position instances.
     * Before highlighting, previously highlighted cells get un-highlighted again.
     *
     * TODO: Refactor to use a Spread.selection.Range to remember all current highlighted cells.
     * TODO: Maybe rewrite / reimplement a new method highlightCell() which does take care of the current positions view
     * TODO: Or maybe just rewrite to use a Range!!
     *
     * @param {Array} positions Array of position instances
     * @return void
     */
    highlightCells: function(positions) {

        var me = this, _highlight = function(methodName) {

            for (var i=0; i<me.currentHighlightPositions.length; i++) {

                // (Un-)highlight visually by adding/removing CSS class
                Ext.fly(me.currentHighlightPositions[i].validate().cellEl)
                    .down('div')[methodName]('spreadsheet-cell-selection-cover');
            }
        };

        // Interceptable before-eventing
        if (this.fireEvent('beforehighlightcells', this, positions) !== false) {

            // Un-highlight first
            if (this.currentHighlightPositions.length > 0) {

                // Remove CSS class from all cells
                _highlight('removeCls');
            }

            if (positions) {

                // Switch local data
                this.currentHighlightPositions = positions;

                // Add CSS class to all cells
                _highlight('addCls');
            }

            // Fire event
            this.fireEvent('highlightcells', this, positions);
        }
    },

    /**
     *
     */
    highlightCell: function() {

    },

    /**
     * Returns the cover element as Ext.dom.Element instance or null
     * @return {Ext.dom.Element|null}
     */
    getCellCoverEl: function() {
        return Ext.get(this.cellCoverEl);
    }
});
/**
 * @class Spread.grid.column.Header
 *
 * A grid column which cells look and feel like column headers. (Grayed out)
 * Typically used as first column like a row numberer - known from spreadsheet applications.
 */
Ext.define('Spread.grid.column.Header', {

    extend: 'Ext.grid.RowNumberer',

    alias: 'widget.spreadheadercolumn',

    /**
     * @cfg {Boolean} editable
     * If a column is configured as header column, the values aren't editable by default.
     * If it should be editable, it needs to be selectable too.
     */
    editable: false,

    /**
     * @cfg {Number} columnWidth
     * Width of the header column width in pixel
     */
    columnWidth: 60,

    /**
     * @cfg {Boolean} selectable
     * If a column is configured as header column, the values aren't selectable nor focusable by default
     */
    selectable: false,

    /**
     * @cfg {String} dataIndex
     * Index of the column id by default
     */
    dataIndex: 'id',

    // Resizing is allowed by default
    resizable: true,

    /**
     * @private
     */
    constructor: function(config) {

        // Reinvent the logic of Ext.grid.column.Column and prevent RowNumberer logic
        config.width = config.columnWidth || this.columnWidth;

        // TODO: Handle renderer given by instance configuration (config!)

        this.callParent(arguments);
    },

    // private
    renderer: function(value, metaData, record, rowIdx, colIdx, store) {

        var rowspan = this.rowspan;

        if (rowspan){
            metaData.tdAttr = 'rowspan="' + rowspan + '"';
        }
        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-header ' +
                         Ext.baseCSSPrefix + 'grid-cell-special';
        return value;
    }
});
/**
 * @class Spread.overrides.Column
 * @overrides Ext.grid.column.Column
 * Overrides to the standard gird column to implement spreadsheet-specific features.
 */
Ext.define('Spread.overrides.Column', {

    override: 'Ext.grid.column.Column',

    /**
     * @cfg {Boolean} selectable
     * If a column is configured as header column, the values aren't selectable nor focusable
     */
    selectable: true,

    /**
     * @cfg {Boolean} editable
     * If the column is editable, the edit fields gets active on key type-in or double-clicking
     */
    editable: true,

    /**
     * @cfg {Boolean} autoCommit
     * Auto-commit cell data changes on record automatically
     * (otherwise the data change indicator will be shown and record needs to be commit()'ed manually!
     */
    autoCommit: false,

    /**
     * @cfg {Function} cellwriter
     * Pre-processor function for cell data write operations - if you want to modify cell data before record update.
     * (e.g. when edit field gets blur()'ed and updates the record AND when selection paste (ctrl+v) happens,
     * this function gets called, when it's defined. The return value of this function will be used as new data value.
     */
    cellwriter: null,

    /**
     * @cfg {Function} cellreader
     * Pre-processor function for cell read operations - if you want to modify cell data while reading from record.
     * (e.g. when edit field gets active and loads cell data AND when selection copy (ctrl+c) happens,
     * this function gets called, when it's defined. The return value of this function will be used.
     */
    cellreader: null,

    /**
     * @cfg {Boolean} editModeStyling
     * If you enable special styles for editable columns they will
     * be displayed with a special background color and selection color.
     */
    editModeStyling: true,

    /**
     * @cfg {Array} allowedEditKeys
     * Specifies the allowed keys so that only these keys can be typed into the edit field
     */
    allowedEditKeys: [],

    // internal flag
    initialPanelEditModeStyling: false,

    // private
    initComponent: function() {

        // Handle UI stuff
        this.initDynamicColumnTdCls();

        // Call parent
        this.callParent(arguments);
    },

    /**
     * @private
     * Handles cell <td> addition of CSS classes
     * @return void
     */
    initDynamicColumnTdCls: function() {

        if (!this.selectable) {

            // If not selectable, then editing is impossible
            this.editable = false;

            // Add unselectable class
            this.tdCls = 'spreadsheet-cell-unselectable';
        }

        // Check for editable flag and for edit mode styling
        if (this.editable && this.editModeStyling &&
            this.initialPanelEditModeStyling) {

            // Add editable class
            this.tdCls += ' ' + 'spreadsheet-cell-editable';
        }
    }
});

/**
 * @class Spread.grid.plugin.ClearRange
 * Allows to clears a currently selected range.
 */
Ext.define('Spread.grid.plugin.ClearRange', {

    extend: 'Ext.AbstractComponent',

    alias: 'clearrange',

    /**
     * @property {Spread.grid.View}
     * View instance reference
     */
    view: null,

    /**
     * @property {Spread.grid.Panel}
     * Grid instance reference
     */
    grid: null,

    /**
     * @cfg {Boolean}
     * Should a load mask being displayed when clearing cell data?
     */
    loadMask: true,

    /**
     * @cfg {*}
     * Null value that should be used for clearing cell data
     */
    nullValue: '',

    /**
     * @protected
     * Registers the clear key event handling (BACKSPACE, DEL keys).
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    init: function(view) {

        // Add events
        this.addEvents(

            /**
             * @event beforeclearrange
             * Fires before a copy action happens. Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.ClearRange} clearRange ClearRange plugin instance
             * @param {Spread.selection.RangeModel} selModel Selection model instance
             * @param {Spread.selection.Range} range Range of selected position
             */
            'beforeclearrange',

            /**
             * @event clearrange
             * Fires when a range clearing has happened.
             * @param {Spread.grid.plugin.ClearRange} clearRange ClearRange plugin instance
             * @param {Spread.selection.RangeModel} selModel Selection model instance
             * @param {Spread.selection.Range} range Range of selected position
             */
            'clearrange'
        );

        var me = this;

        // Set internal reference
        me.view = view;

        // Listen to the key events
        me.listenToKeyEvents();
    },

    listenToKeyEvents: function() {

        var me = this;

        // Un-register on grid destroy
        me.view.on('destroy', function() {
            Ext.EventManager.un(document.body, 'keyup', me.onKeyUp);
        });

        // Listen for keyup globally (stable method to fetch keyup)
        Ext.EventManager.on(document.body, 'keyup', me.onKeyUp, me);
    },

    /**
     * @protected
     * Listen to DEL and BACKSPACE
     * @param {Ext.EventObject} evt Event
     * @return void
     */
    onKeyUp: function(evt) {

        var me = this,
            targetEl = Ext.get(evt.getTarget());

        // 46 is the DEL key
        if (!targetEl.hasCls('spreadsheet-cell-cover-edit-field') &&
            evt.normalizeKey(evt.keyCode) === 46) {

            me.clearCurrentSelectedRange();

            evt.stopEvent();
        }
    },

    /**
     * Fetches the current selected range and clears it's data
     * @return void
     */
    clearCurrentSelectedRange: function() {

        var me = this,
            selectionRange = me.view.getSelectionModel().getCurrentSelectionRange();

        if (me.loadMask) {

            var loadMask = new Ext.LoadMask(me.view.getEl());
            loadMask.show();
            //me.view.setLoading(true);
        }

        // May use requestAnimationFrame here
        setTimeout(function() {

            // Clear data of each position
            selectionRange.each(function(position) {

                // Clear cell data
                position.setValue(me.nullValue);

            }, function onComplete() {

                if (me.loadMask) {
                    //me.view.setLoading(false);
                    loadMask.hide();
                }
            });

        }, 30);
    }
});
/**
 * @private
 * Class which implements clipping for clipboard interaction
 * using a hidden textarea-element.
 */
Ext.define('Spread.util.Clipping', {

    /**
     * @property {Ext.dom.Element}
     * Internal clipboard textarea instance/reference
     */
    el: null,

    /**
     * @property {Number} refocusDelay
     * Re-focus delay in milliseconds from textarea of clipboard back to grid's view
     */
    refocusDelay: 150,

    /**
     * @protected
     * Initialize clipboard on instance create
     * @return void
     */
    initClipping: function() {

        var me = this;

        Ext.onReady(function() {

            if (!me.hasClipboard()) {
                me.createClipboard();
            }
        });
    },

    /**
     * @protected
     * Needs to be called from an key event handler! (Timing matters)
     *
     * Method for preparing clipboard copying by focussing
     * the textarea element and inserting the tsv content.
     * @param {String} tsvData TSV content
     * @param {Spread.grid.View} view Spread view reference
     * @return void
     */
    prepareForClipboardCopy: function(tsvData, view) {

        var me = this;

        me.el.dom.style.display = "block";
        me.el.dom.value = tsvData;

        try {

            me.el.dom.focus();

            // To let the os copy selected text
            me.selectClippingText();

        } catch(e) {}

        // Re-focus the view
        me.refocusView(view);
    },

    /**
     * @protected
     * Selects the contents of the text area.
     * Used to make use of the operating system's default behaviour
     * of copying and pasting when a text area is focused and selected.
     * @return void
     */
    selectClippingText: function() {

        var me = this,
            range;

        // Code to prevent time-async double-paste os behaviours
        if (Ext.isIE) {

            range = me.el.dom.createTextRange();
            range.collapse(true);
            range.moveStart('character', 0);
            range.moveEnd('character', me.el.dom.value.length + 1);
            range.select();

        } else {
            me.el.dom.select();
        }
    },

    /**
     * @protected
     * Needs to be called from an key event handler! (Timing matters)
     *
     * Method for preparing clipboard pasting by focussing
     * the textarea element. Calls the pasteDataCallback
     * function after native paste event has been processed.
     * @param {Function} pasteDataCallback Paste function (first argument is clipboard data)
     * @param {Spread.grid.View} view Spread view reference
     * @return void
     */
    prepareForClipboardPaste: function(pasteDataCallback, view) {

        var me = this;

        me.el.dom.style.display = "block";

        try {

            me.el.dom.focus();

            // Code to prevent time-async double-paste os behaviours
            me.selectClippingText();

        } catch (e) {}

        setTimeout(function() {

            //console.log('Fetch data from clipboard: ', me.el.dom.value.length);

            // Call callback with pasted data
            pasteDataCallback(me.el.dom.value);

            // Reset textarea value
            me.el.dom.value = '';

        }, 150);

        // Re-focus the view
        me.refocusView(view);
    },

    /**
     * @protected
     * Creates a shadow clipboard element
     * @return void
     */
    createClipboard: function() {

        this.el = Ext.get(

            Ext.DomHelper.append(Ext.getBody(), {
                tag: 'textarea',
                cls: 'clipboard-textarea',
                style: {
                    display: 'none',
                    zIndex: -400,
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '0px',
                    height: '0px'
                },
                value: ''
            })

        );
    },

    /**
     * @protected
     * Checks if a clipboard element is available
     * @return {Boolean|Ext.dom.Element}
     */
    hasClipboard: function() {

        var el = Ext.select('.clipboard-textarea').elements[0];

        if (el) {

            this.el = Ext.get(el);
            return true;
        }
        return false;
    },


    /**
     * @protected
     * Re-focusses the view after a small time delay
     * @param {Spread.grid.View} view Spread view reference
     * @return void
     */
    refocusView: function(view) {

        var me = this;

        setTimeout(function() {

            try {
                view.getEl().focus();
            } catch (e) {}

            me.el.dom.style.display = "none";

        }, me.refocusDelay);
    }
});
/**
 * @class Spread.grid.plugin.Copyable
 * Allows copying data from a focused cell or a selected cell range by Ctrl/Cmd + C keystroke and
 * to be pasted in a native spreadsheet application like e.g. OpenOffice.org Calc.
 */
Ext.define('Spread.grid.plugin.Copyable', {

    extend: 'Ext.AbstractComponent',

    alias: 'copyable',

    mixins: {
        clipping: 'Spread.util.Clipping'
    },

    /**
     * @property {Spread.grid.View}
     * View instance reference
     */
    view: null,

    /**
     * @protected
     * Registers the copy keystroke event handling mechanism.
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    init: function(view) {

        // Add events
        this.addEvents(

            /**
             * @event beforecopy
             * Fires before a copy action happens. Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Copyable} copyable Copyable plugin instance
             * @param {Spread.selection.RangeModel} selModel Selection model instance
             * @param {Array} selections Array of selected positions
             */
            'beforecopy',

            /**
             * @event copy
             * Fires when a copy action happened.
             * @param {Spread.grid.plugin.Copyable} copyable Copyable plugin instance
             * @param {Spread.selection.RangeModel} selModel Selection model instance
             * @param {Array} selections Array of selected positions
             */
            'copy'
        );

        // Initialize clipping mixin
        this.initClipping();

        var me = this;

        // Set internal reference
        me.view = view;

        // Init key navigation
        this.initKeyNav(view);
    },

    /**
     * @protected
     * Initializes the key navigation
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    initKeyNav: function(view) {

        var me = this;

        if (!view.rendered) {
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
        }

        // Register key-stroke event detector
        view.getEl().on('keydown', me.detectCopyKeyStroke, me);
    },

    /**
     * @protected
     * Detects copy key-strokes (ctrl+c, cmd+c) and calls the
     * clipping mixin to hook the native event loop for clipboard
     * interaction. Also calls the TSVTransformer to transform
     * the data of an already selected range into TSV data.
     *
     * @param {Ext.EventObject} evt Key event
     * @return void
     */
    detectCopyKeyStroke: function(evt) {

        if (evt.getKey() === evt.C && evt.ctrlKey) {
            this.copyToClipboard();
        }
    },

    /**
     * @protected
     * Copies selected range data to the native system clipboard
     * @return void
     */
    copyToClipboard: function() {

        //console.log('copying to clipboard');

        var selModel = this.view.getSelectionModel(),
            selectionPositions = selModel.getSelectedPositionData();

        // Fire interceptable event
        if (this.fireEvent('beforecopy', this, selModel, selectionPositions) !== false) {

            // Prepare
            this.prepareForClipboardCopy(
                Spread.util.TSVTransformer.transformToTSV(selectionPositions),
                this.view
            );

            // Fire event
            this.fireEvent('copy', this, selModel, selectionPositions);
        }
    }
});
/**
 * @class Spread.grid.plugin.Editable
 * Allows the spreadsheet to get edited by a text field as known from standard spreadsheet applications.
 *
 * TODO: Support string fields without allowedKeys config to enter special chars!
 */
Ext.define('Spread.grid.plugin.Editable', {

    extend: 'Ext.AbstractComponent',

    alias: 'editable',

    /**
     * @property {Spread.grid.View}
     * View instance reference
     */
    view: null,

    /**
     * @cfg {Boolean} autoCommit
     * Automatically commit changed records or wait for manually store.sync() / record.commit()?
     * (Generally, can be specially configured per column config too)
     */
    autoCommit: true,

    /**
     * @cfg {Number} stopEditingFocusDelay
     * Delay of timeout until view gets focused again after editing in ms
     */
    stopEditingFocusDelay: 50,

    /**
     * @cfg {Number} retryFieldElFocusDelay
     * Delay of timeout until the edit field gets tried to focused again (special case)
     */
    retryFieldElFocusDelay: 20,

    /**
     * @cfg {Number} chunkRenderDelay
     * Delay of rendering chunks in ms (too low values may let the browser freeze if grid is very big).
     * This performance optimization technique is used only when editModeStyling is activated and cells
     * need to be re-inked on this.setDisabled() / grid's setEditable() calls.
     */
    chunkRenderDelay: 0.1,

    /**
     * @cfg {Number} cellChunkSize
     * Size of the chunks (cells) to render at once (see chunkRenderDelay for further information)
     */
    cellChunkSize: 300,

    /**
     * @property {Spread.selection.Position}
     * Currently active editing position
     */
    activePosition: null,

    /**
     * @property {Ext.dom.Element}
     * Currently active cover element
     */
    activeCoverEl: null,

    /**
     * @property {Ext.dom.Element}
     * Currently active cell td element
     */
    activeCellTdEl: null,

    /**
     * @property {Object}
     * Currently active cover element size (containing width, height properties measured in pixels)
     */
    activeCoverElSize: null,

    /**
     * @property {Array}
     * Currently active cover element position (top, left pixel position relative to view)
     */
    activeCoverElPosition: null,

    /**
     * @property {Ext.dom.Element}
     * Reference to the origin edit field input-HTML-element
     */
    cellCoverEditFieldEl: null,

    // Private
    isEditing: false,

    /**
     * @cfg {Boolean} editModeStyling
     * Allows to style the cells when in edit mode
     */
    editModeStyling: true,

    /**
     * @cfg {String} editableCellCls
     * Name of the css class for editable spreadsheet cells
     */
    editableCellCls: 'spreadsheet-cell-editable',

    /**
     * @cfg {String} editableDirtyCellCls
     * Name of the css class for editable spreadsheet cells which are dirty too
     */
    editableDirtyCellCls: 'spreadsheet-cell-editable-dirty',

    /**
     * @property {Mixed} lastEditFieldValue
     * Stores the last edit field value
     */
    lastEditFieldValue: null,

    // Internal storage (shadow-copy) of editable columns references
    editableColumns: [],

    // Internal list of indexes of the columns which are editable
    editableColumnIndexes: [],

    // Internal editable flag
    editable: false,

    /**
     * @protected
     * Registers the hook for cover-double-click editing
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    init: function(view) {

        var me = this;

        // Set internal reference
        me.view = view;

        // Add events
        this.addEvents(

            /**
             * @event beforeeditfieldblur
             * Fires before a edit field gets blur()'ed. Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'beforeeditfieldblur',

            /**
             * @event editfieldblur
             * Fires when a edit field gets blur()'ed.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'editfieldblur',

            /**
             * @event beforecoverdblclick
             * Fires before a covers dbl-click action happened (starting editing). Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'beforecoverdblclick',

            /**
             * @event coverdblclick
             * Fires when a covers dbl-click action happened (starting editing).
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'coverdblclick',

            /**
             * @event beforecoverkeypressed
             * Fires before a cover's keypress-click action happened (starting editing). Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'beforecoverkeypressed',

            /**
             * @event coverkeypressed
             * Fires when a cover's keypress-click action happened (starting editing).
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'coverkeypressed',

            /**
             * @event beforeeditingenabled
             * Fires before editing gets generally activated. Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'beforeeditingenabled',

            /**
             * @event editingenabled
             * Fires when editing gets generally activated.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'editingenabled',

            /**
             * @event beforeeditingdisabled
             * Fires before editing gets generally deactivated. Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'beforeeditingdisabled',

            /**
             * @event editingdisabled
             * Fires when editing gets generally deactivated.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             */
            'editingdisabled',

            /**
             * @event covercelleditable
             * Fires after a cell got covered for editing.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             * @param {Spread.grid.View} view Spread view instance
             * @param {Spread.selection.Position} position Position to be covered
             * @param {Ext.dom.Element} coverEl Cover element
             */
            'covercelleditable',

            /**
             * @event editablechange
             * Fires after the editable flag has changed and all re-rendering has been done.
             * Use this event if you e.g. want to reload the store "directly" after calling setEditable() etc.
             * @param {Spread.grid.plugin.Editable} editable Editable plugin instance
             * @param {Boolean} isEditable Indicator if the spread is now editable or not
             */
            'editablechange'
        );

        // Register eventing hook
        this.initCoverEventing();
    },

    /**
     * @protected
     * Registers key and mouse eventing on the cover element of the view
     * @return void
     */
    initCoverEventing: function() {

        var me = this;

        // Call the following methods after rendering...
        this.view.on('afterrender', function(view) {

            // Collect editable flags from the columns
            me.initEditingColumns(view);

            // Initialize editable eventing
            me.initEventing(view);
        });
    },

    /**
     * @protected
     * Implements listeners and hooks for eventing which belongs
     * to the edit field, cover element, view and selection model.
     * @param {Spread.grid.View} view View reference
     * @return void
     */
    initEventing: function(view) {


        // Handle eventing of cover element
        var me = this,
            coverEl = view.getCellCoverEl();

        //console.log('initEventing!', coverEl);
        if (coverEl) {

            //console.log('found a view to hook on', coverEl, this.cellCoverEditFieldEl);

            // Render the text field
            me.initTextField(coverEl);

            // Listen to cover double click
            //coverEl.on('dblclick', me.onCoverDblClick, me);

            // Double-click based edit mode handler
            me.view.getEl().on('dblclick', me.onCoverDblClick, me);

            // Listen to cover key pressed (up)
            view.getEl().on('keydown', me.onCoverKeyPressed, me);

            // Listen to view's cover
            view.on('covercell', me.onCellCovered, me);

            // Handle TAB and ENTER select while editing (save and focus next cell)
            //view.getSelectionModel().on('tabselect', me.blurEditFieldIfEditing, me);
            //view.getSelectionModel().on('enterselect', me.blurEditFieldIfEditing, me);
            view.getSelectionModel().on('beforecellfocus', me.blurEditFieldIfEditing, me);
            view.getSelectionModel().on('keynavigate', me.blurEditFieldIfEditing, me);
            //view.getSelectionModel().on('cellblur', me.blurEditFieldIfEditing, me);

        } else {
            throw "Cover element not found, initializing editing failed! Please check proper view rendering.";
        }
    },

    /**
     * @protected
     * Collects the 'editable' flags from the columns and stores them in
     * this.editableColumns array initially.
     * @param {Spread.grid.View} view Grid view
     * @return void
     */
    initEditingColumns: function(view) {

        var columns = view.getHeaderCt().getGridColumns();

        // Initialize arrays
        this.editableColumns = [];
        this.editableColumnIndexes = [];

        for (var i=0; i<columns.length; i++) {

            if (columns[i].editable) {

                // Push to list of editable columns
                this.editableColumns.push(columns[i]);

                // Set reference on column
                columns[i].columnIndex = i;

                // Push to list of editable columns indexes
                this.editableColumnIndexes.push(i);
            }
        }
    },

    /**
     * @protected
     * For initializing, the text field DOM elements need to be generated.
     * @param {Ext.dom.Element} coverEl Cover element reference
     * @return void
     */
    initTextField: function(coverEl) {

        // Check for field existence (already created?)
        if (!this.cellCoverEditFieldEl) {

            //console.log('initTextField', arguments);

            // Build editor field
            this.cellCoverEditFieldEl = Ext.get(

                Ext.DomHelper.append(coverEl, {
                    id: Ext.id() + '-cover-input',
                    tag: 'input',
                    type: 'text',
                    cls: 'spreadsheet-cell-cover-edit-field',
                    value: ''
                })
            );

            // Register key up handler
            this.cellCoverEditFieldEl.on('keypress', this.onEditFieldKeyPressed, this);
        }
    },

    /**
     * @protected
     * Stops the edit mode
     * @return void
     */
    onEditFieldBlur: function() {

        //console.log('onEditFieldBlur');

        // Fire interceptable event
        if (this.fireEvent('beforeeditfieldblur', this) !== false) {

            // Internal flag to prevent two-time rendering
            this.view.dataChangedRecently = true;

            // Stop editing (mode)
            this.setEditing(false);

            // Write changed value back to record/field
            this.activePosition.setValue(
                this.getEditingValue(),
                this.autoCommit
            );

            // Recolorize for dirty flag!
            this.handleDirtyMarkOnEditModeStyling();

            // Fire event
            this.fireEvent('editfieldblur', this);
        }
    },

    /**
     * @protected
     * Full redraw on edit mode styling after each edit field change
     * @return void
     */
    handleDirtyMarkOnEditModeStyling: function() {

        // Full redraw
        if (this.view.ownerCt.editModeStyling) {
            this.displayCellsEditing(true);
        } else {
            this.displayCellsEditing(false);
        }
    },

    /**
     * @protected
     * Blurs the editor field if editing is happening and
     * the user pressed TAB or ENTER to focus next cell.
     * (blur causes the editor to save its changed data)
     * @return void
     */
    blurEditFieldIfEditing: function() {

        //console.log('blurEditFieldIfEditing', this.isEditing)

        if (this.isEditing) {
            this.onEditFieldBlur();
        }
    },

    /**
     * @protected
     * Handles special keys (ENTER, TAB) and
     * allowed input character limiting.
     * @param {Ext.EventObject} evt Key event
     * @return {Boolean}
     */
    onEditFieldKeyPressed: function(evt) {

        var me = this;

        if (this.isEditing) {

            if (Spread.util.Key.isCancelEditKey(evt)) {

                //console.log('is cancel edit key')
                this.blurEditFieldIfEditing();
                return true;
            }
            //console.log('columns keys allowed? ', me.activePosition.columnHeader.allowedEditKeys);

            // If there is a list of allowed keys, check for them
            if (me.activePosition.columnHeader.allowedEditKeys.length > 0) {

                // Stop key input if not in allowed keys list
                if (Ext.Array.indexOf(me.activePosition.columnHeader.allowedEditKeys,
                        String.fromCharCode(evt.getCharCode())
                    ) === -1 && evt.getKey() !== evt.BACKSPACE)
                {
                    evt.stopEvent();
                }
            }

        } else {

            // Save and jump next cell
            if (evt.getKey() === evt.ENTER) {
                me.view.getSelectionModel().onKeyEnter(evt);
            }

            // Save and jump next cell
            if (evt.getKey() === evt.TAB) {
                me.view.getSelectionModel().onKeyTab(evt);
            }

            // Key navigation support (jumping out of field)
            if (evt.getKey() === evt.LEFT) {
                me.view.getSelectionModel().onKeyLeft(evt);
            }

            if (evt.getKey() === evt.RIGHT) {
                me.view.getSelectionModel().onKeyRight(evt);
            }

            if (evt.getKey() === evt.UP) {
                me.view.getSelectionModel().onKeyUp(evt);
            }

            if (evt.getKey() === evt.DOWN) {
                me.view.getSelectionModel().onKeyDown(evt);
            }
        }
    },

    // Internal method for checking if a user clicked on a cell cover
    // which is covering the currently focused cell.
    isOriginCellClick: function(evt) {

        var clickedOnCell = false,
            clickTargetElIdTextParent = evt.getTarget().parentNode.parentNode.id,
            clickTargetElIdText = evt.getTarget().parentNode.id,
            clickTargetElId = evt.getTarget().id,
            currentPosCellElId = this.view.getSelectionModel().getCurrentFocusPosition().cellEl.id;

        if (Ext.isIE) {

            if (clickTargetElId.indexOf(currentPosCellElId) > -1 ||
                clickTargetElIdText.indexOf(currentPosCellElId) > -1 ||
                clickTargetElIdTextParent.indexOf(currentPosCellElId) > -1) {
                clickedOnCell = true;
            }

        } else {

            if (clickTargetElId.indexOf(currentPosCellElId) > -1) {
                clickedOnCell = true;
            }
        }
        return clickedOnCell;
    },


    /**
     * @protected
     * When a user double-clicks on a cell cover, this method
     * gets called and chooses if the text field should be shown
     * based on the pre-annotation already made by this.onCellCovered.
     * @param {Ext.EventObject} evt Key event
     * @return void
     */
    onCoverDblClick: function(evt) {

        if (this.fireEvent('beforecoverdblclick', this) !== false) {

            // Clicked on grid view
            // ...and not already editing
            // ...and clicked on cell cover of the current selected cell position
            // ...and if position is generally editable
            if (!Ext.get(evt.getTarget()).hasCls('x-grid-view') &&
                !this.isEditing &&
                this.isOriginCellClick(evt) &&
                this.isPositionEditable()) {

                //console.log('onCoverDblClick, setEditable!');

                // Activates the editor
                this.setEditing(true);

                // Set current value of field in record
                this.setEditingValue(
                    this.activePosition.getValue()
                );
            }
            this.fireEvent('coverdblclick', this);
        }
    },

    /**
     * @protected
     * Handles key-up-events when a key is pressed when a cell is covered and focused.
     * @param {Ext.EventObject} evt Key event
     * @param {Ext.dom.Element} viewEl View's element
     * @return void
     */
    onCoverKeyPressed: function(evt, viewEl) {

        // no key is pressed on a cover,
        // if we're editing...
        if (this.isEditing) {
            return;
        }

        if (this.fireEvent('beforecoverkeypressed', this) !== false) {

            if (Spread.util.Key.isStartEditKey(evt) && !this.isEditing) {

                if (this.isPositionEditable()) {

                    // Activates the editor
                    this.setEditing(true);

                    // Reset the editor value
                    this.setEditingValue('');
                }
            }
            this.fireEvent('coverkeypressed', this);
        }
    },

    /**
     * @protected
     * When a cell gets covered, this method chooses if the text field,
     * generated by this.initTextField() gets active or not based on the
     * cell columns editable flag. It also updates the text fields meta
     * properties to react fast and responsive on UI eventing
     * (pre-annotation of field value etc. pp.)
     * @return void
     */
    onCellCovered: function(view, position, coverEl, tdEl, coverElSize, coverElPosition) {

        //console.log('onCellCovered', position);

        // Set internal references
        this.activePosition = position;
        this.activeCellTdEl = tdEl;
        this.activeCoverEl = coverEl;
        this.activeCoverElSize = coverElSize;
        this.activeCoverElPosition = coverElPosition;

        // But hide, until this.setEditing() is called through UI event
        this.cellCoverEditFieldEl.dom.style.display = 'none';

        this.fireEvent('covercelleditable', this, view, position, coverEl);
    },

    /**
     * Checks if the current position is editable
     * @return {Boolean}
     */
    isPositionEditable: function() {

        // Check for row to be editable or not
        // TODO!

        // Check for column to be editable or not
        if ((this.activePosition && !this.activePosition.columnHeader.editable) ||
            !this.editable) {

            //console.log('!this.activePosition.columnHeader.editable || !this.editable', !this.activePosition.columnHeader.editable, !this.editable)
            return false;
        }
        return true;
    },

    /**
     * Sets the editor active or inactive
     * @param {Boolean} doEdit=true Should edit mode be started?
     * @return void
     */
    setEditing: function(doEdit) {

        var me = this;

        // Default value = true
        if (!Ext.isDefined(doEdit)) {
            doEdit = true;
        }

        // Check global and column edit-ability
        if (!this.isPositionEditable()) {
            return false;
        }

        //console.log('setEditing ', doEdit);

        // Set editing
        if (doEdit) {

            if (this.fireEvent('beforeeditingenabled', this) !== false) {

                // Enable edit mode
                me.isEditing = true;

                // Show the editor
                me.cellCoverEditFieldEl.dom.style.display = 'inline';

                // Focus the edit field
                try {
                    me.cellCoverEditFieldEl.dom.focus();
                } catch(e) {}

                // Re-try after a small delay to ensure focus
                // (e.g. when rendering delay takes place while cell-to-cell edit mode jumps)
                setTimeout(function() {

                    try {
                        me.cellCoverEditFieldEl.dom.focus();
                    } catch(e) {}

                }, me.retryFieldElFocusDelay);

                this.fireEvent('editingenabled', this);
            }

        } else {

            if (this.fireEvent('beforeeditingdisabled', this) !== false) {

                // Hide the editor
                me.cellCoverEditFieldEl.dom.style.display = 'none';

                // Blur the edit field (and focus view element again to re-enable key-stroke navigation)
                setTimeout(function() {

                    try {
                        me.view.focus();
                    } catch(e) {}

                }, me.stopEditingFocusDelay);

                // Disable edit mode
                me.isEditing = false;

                this.fireEvent('editingdisabled', this);
            }
        }
    },

    /**
     * Sets the edit field value
     * @param {String} value Editing value
     * @return void
     */
    setEditingValue: function(value) {

        // Set value in editor field
        this.cellCoverEditFieldEl.dom.value = value;
    },

    /**
     * Returns the current edit field value
     * @return {String}
     */
    getEditingValue: function() {
        return this.cellCoverEditFieldEl.dom.value;
    },

    /**
     * En/Disables editing grid-wide
     * @param {Boolean} allowEditing Is editing allowed?
     * @return void
     */
    setDisabled: function(allowEditing) {

        //console.log('en/disable editing globally:', allowEditing, this);

        // Closure, column editable processor
        var me = this,
            toggleColumnsEditable = function(isEditable) {

            for (var i=0; i<me.editableColumns.length; i++) {
                me.editableColumns[i].editable = isEditable;
            }
        };

        if (!allowEditing) {

            // Disable editing if currently
            me.setEditing(false);

            // Set flag
            me.editable = false;

            // Loop and disable editing on columns
            toggleColumnsEditable(false);

            // Display cells in read mode
            if (me.editModeStyling) {

                me.displayCellsEditing(false, function() {

                    // Fire event
                    me.fireEvent('editablechange', me, allowEditing);
                });
            } else {

                // Fire event
                me.fireEvent('editablechange', me, allowEditing);
            }

        } else {

            // Set flag
            me.editable = true;

            // Loop and disable editing on columns
            toggleColumnsEditable(true);

            // Display cells in edit mode

            if (me.editModeStyling) {

                me.displayCellsEditing(true, function() {

                    // Fire event
                    me.fireEvent('editablechange', me, allowEditing);
                });
            } else {

                // Fire event
                me.fireEvent('editablechange', me, allowEditing);
            }
        }
    },

    /**
     * Displays the grid cells in edit or read mode
     * @param {Boolean} displayEditing Display cells as editing?
     * @param {Function} [onRenderReady] Function to be called when ready
     * @return void
     */
    displayCellsEditing: function(displayEditing, onRenderReady) {

        var me = this, viewCells = me.view.getEl().query(
            me.view.cellSelector
        ), viewColumns = me.view.getHeaderCt().getGridColumns();

        if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
            me.chunkRenderDelay = 0.3;
            me.cellChunkSize = 200;
        }

        // Chunk-style cells
        var chunkCellProcessor = function(startIdx, stopIdx) {

            for (var i=startIdx; i<stopIdx; i++) {

                // Jump-over non-exiting AND non-editable cells (of non-editable columns) AND
                // when a column should be inked which has an implicit editModeStyling=false flag!
                if (!viewCells[i] ||
                    Ext.Array.indexOf(me.editableColumnIndexes, viewCells[i].cellIndex) < 0 ||
                    (viewColumns[viewCells[i].cellIndex] &&
                     viewColumns[viewCells[i].cellIndex].editModeStyling === false)) {
                    continue;
                }

                if (displayEditing) {

                    // Add css class
                    if (!Ext.fly(viewCells[i]).hasCls(me.editableCellCls)) {

                        if (Ext.fly(viewCells[i]).hasCls('x-grid-dirty-cell')) {
                            Ext.fly(viewCells[i]).addCls(me.editableDirtyCellCls);
                        } else {
                            Ext.fly(viewCells[i]).addCls(me.editableCellCls);
                        }
                    }

                } else {

                    Ext.fly(viewCells[i]).removeCls(me.editableCellCls);
                    Ext.fly(viewCells[i]).removeCls(me.editableDirtyCellCls);
                }
            }

            if (stopIdx < viewCells.length) {

                startIdx += me.cellChunkSize;
                stopIdx += me.cellChunkSize;

                // Render delayed
                setTimeout(function() {

                    // Recursive call
                    chunkCellProcessor(startIdx, stopIdx);

                }, me.chunkRenderDelay);
            } else {

                if (onRenderReady && Ext.isFunction(onRenderReady)) {
                    onRenderReady();
                }
            }
        };

        // Chunk the for processing
        chunkCellProcessor(0, me.cellChunkSize);
    }
});
/**
 * @class Spread.grid.plugin.Pasteable
 * Allows the spreadsheet to receive data from a native spreadsheet application like
 * e.g. OpenOffice.org Calc by pasting into a selected cell range or right-down direction from a focused cell
 * using the keystroke Ctrl/Cmd + V.
 */
Ext.define('Spread.grid.plugin.Pasteable', {

    alias: 'pasteable',

    extend: 'Ext.AbstractComponent',

    mixins: {
        clipping: 'Spread.util.Clipping'
    },

    /**
     * @property {Spread.grid.View}
     * View instance reference
     */
    view: null,

    /**
     * @cfg {Boolean}
     * Should changed cell data be automatically committed?
     * This config gets auto-applied from spread grid panel.
     */
    autoCommit: false,

    /**
     * @cfg {Boolean}
     * Indicator if a load mask should be shown while pasting
     */
    loadMask: true,

    /**
     * @cfg {Boolean}
     * Using internal API's allows a much faster record data changing.
     * Using internal API's is dangerous. If this method doesn't work
     * after a framework update anymore, just switch this flag to false!
     * EXPERIMENTAL. Dirty flag is known to be buggy in this release.
     */
    useInternalAPIs: false,

    /**
     * @protected
     * Registers the paste keystroke event handling mechanism.
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    init: function(view) {

        // Add events
        this.addEvents(

            /**
             * @event beforepaste
             * Fires before a paste action happens. Return false in listener to stop the event processing.
             * @param {Spread.grid.plugin.Pasteable} pasteable Pasteable plugin instance
             * @param {Spread.selection.RangeModel} selModel Selection model instance
             * @param {Array} selections Array of selected positions
             */
            'beforepaste',

            /**
             * @event paste
             * Fires when a paste action happened.
             * @param {Spread.grid.plugin.Pasteable} pasteable Pasteable plugin instance
             * @param {Spread.selection.RangeModel} selModel Selection model instance
             * @param {Array} selections Array of selected positions
             * @param {Array} pastedData Array of pasted data
             */
            'paste'
        );

        // Initialize clipping mixin
        this.initClipping();

        var me = this;

        // Set internal reference
        me.view = view;

        // Init key navigation
        this.initKeyNav(view);
    },

    /**
     * @protected
     * Initializes the key navigation
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    initKeyNav: function(view) {

        var me = this;

        if (!view.rendered) {
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
        }

        // Register key-stroke event detector
        view.getEl().on('keydown', me.detectPasteKeyStroke, me);
    },

    /**
     * @protected
     * Detects paste key-strokes (ctrl+v, cmd+v) and calls the
     * clipping mixin to hook the native event loop for clipboard
     * interaction. Also calls the TSVTransformer to transform
     * the pasted data into array data.
     *
     * @param {Ext.EventObject} evt Key event
     * @return void
     */
    detectPasteKeyStroke: function(evt) {

        if (evt.getKey() === evt.V && evt.ctrlKey) {
            this.pasteFromClipboard();
        }
    },

    /**
     * @protected
     * Pastes selected range data from the native clipboard to
     * the text area and then onto the record fields.
     * @return void
     */
    pasteFromClipboard: function() {

        //console.log('pasting from clipboard');

        var me = this,
            selModel = this.view.getSelectionModel(),
            selectionPositions = selModel.getSelectedPositionData();

        if (me.loadMask) {

            var loadMask = new Ext.LoadMask(me.view.getEl());
            loadMask.show();
            //me.view.setLoading(true);
        }

        // Fire interceptable event
        if (this.fireEvent('beforepaste', this, selModel, selectionPositions) !== false) {

            this.prepareForClipboardPaste(function(clipboardData) {

                //console.log('Clipboard data:', clipboardData);

                // Call the transformer to transform and insert data
                var pastedDataArray = Spread.util.TSVTransformer.transformToArray(clipboardData);

                //console.log('Pasted data array:', pastedDataArray);

                // Call the method to paste the data into the store
                me.updateRecordFieldsInStore(pastedDataArray, selectionPositions, selModel);

                me.fireEvent('paste', me, selModel, selectionPositions, pastedDataArray);

                if (me.loadMask) {
                    //me.view.setLoading(false);
                    loadMask.hide();
                }

            }, this.view);
        }
    },

    /**
     * @protected
     * Update the store records selected in the range of selectionPositions.
     * @param {Array} pastedDataArray Clipboard data converted as flat array
     * @param {Array} selectionPositions Selected positions
     * @param {Spread.selection.RangeModel} selModel Selection model
     * @return void
     */
    updateRecordFieldsInStore: function(pastedDataArray, selectionPositions, selModel) {

        var me = this;

        //console.log('updateRecordFieldsInStore', selModel, pastedDataArray, selectionPositions);

        // Selects a range of cells
        function selectRangeByNewPosition(newOriginSelectionPosition, newFocusPosition) {

            //console.log('select new range', newOriginSelectionPosition, newFocusPosition);

            // Switch position references
            selModel.currentFocusPosition = newFocusPosition;
            selModel.originSelectionPosition = newOriginSelectionPosition;

            // Try selecting range
            selModel.selectFocusRange(true);
        }

        // Do nothing, if nothing is selected or nothing was pasted
        if (selectionPositions.length === 0 || pastedDataArray.length === 0) {
            //console.log('return, because no selection was found');
            return;
        }

        // Single cell paste, just set data on focus position
        if (pastedDataArray.length === 1 && pastedDataArray[0].length === 1) {

            var newFocusPosition = selectionPositions[0].validate();

            /*console.log(
                'setting data value',
                newFocusPosition,
                pastedDataArray[0][0]
            );*/

            // Never paste on non-editable columns!
            if (!newFocusPosition.columnHeader.editable) {
                return;
            }

            // Set data on field of record
            newFocusPosition.setValue(
                pastedDataArray[0][0],
                me.autoCommit
            );

            // Redraw edit mode styling
            me.handleDirtyMarkOnEditModeStyling();

            return;
        }

        // Build real selectionPositions array
        if (selectionPositions.length === 1) {

            var newOriginSelectionPosition = selectionPositions[0].validate(),
                newFocusPosColumnIndex = newOriginSelectionPosition.column,
                newFocusPosRowIndex = newOriginSelectionPosition.row,
                newFocusPosition = null;

            //console.log('detect selection out of focus position', newFocusPosRowIndex);

            // Increment row (-2 because the selected position also is a row)
            newFocusPosRowIndex += (pastedDataArray.length - 1);

            // Selected (-1 because the selected position also is a column)
            newFocusPosColumnIndex += (pastedDataArray[0].length - 1);

            // Lets try this position
            newFocusPosition = new Spread.selection.Position(
                me.view,
                newFocusPosColumnIndex,
                newFocusPosRowIndex
            );

            //console.log('originPosition would be: ', newOriginSelectionPosition);
            //console.log('focusPosition would be: ', newFocusPosition);

            // Select range
            selectRangeByNewPosition(newOriginSelectionPosition, newFocusPosition);
        }

        // Update selection info
        selectionPositions = selModel.getSelectedPositionData();

        // Selection exists, change data for cells in selection
        //console.log('change data inside selection: ', selectionPositions, pastedDataArray);

        var newOriginSelectionPosition = selectionPositions[0].validate();
        var projectedColumnIndex = 0;
        var projectedRowIndex = 0;
        var lastProjectedRowIndex = 0;

        // Walk selected positions to set new field/cell values
        for (var i=0; i<selectionPositions.length; i++) {

            // Update record references
            selectionPositions[i].validate();

            // Never paste on non-editable columns!
            if (!selectionPositions[i].columnHeader.editable) {
                continue;
            }

            // Matrix-project row and column index of grid (coordinates) onto selected range (coordinates)
            projectedRowIndex = (selectionPositions[i].row-newOriginSelectionPosition.row);
            projectedColumnIndex = (selectionPositions[i].column-newOriginSelectionPosition.column)

            // Update last projected row index
            lastProjectedRowIndex = projectedRowIndex;

            /*
            console.log(
                'setting data values',
                selectionPositions[i],
                pastedDataArray[projectedRowIndex][projectedColumnIndex],
                projectedRowIndex,
                projectedColumnIndex
            );
            */

            // Set new data value
            selectionPositions[i].setValue(
                pastedDataArray[projectedRowIndex][projectedColumnIndex],
                me.autoCommit,
                me.useInternalAPIs
            );
        }


        // Using internal API's we've changed the internal
        // values now, but we need to refresh the view for
        // data values to be updates
        me.view.refresh();

        // Redraw edit mode styling
        me.handleDirtyMarkOnEditModeStyling();

        // Highlight pasted data selection cells
        me.view.highlightCells(selectionPositions);
    },

    /**
     * @protected
     * Full redraw on edit mode styling after each edit field change
     * @return void
     */
    handleDirtyMarkOnEditModeStyling: function() {

        if (this.view.editable) {

            // Full redraw
            this.view.editable.displayCellsEditing(false);

            if (this.view.ownerCt.editModeStyling) {
                this.view.editable.displayCellsEditing(true);
            }
        }
    }
});
// TODO: For context menu, translate menu item titles
/**
 * @class Spread.selection.Position
 *
 * Class for representing a position in the grid view / selection model.
 * Instances of this class are used for identifying all components which
 * belong to a single cell. Such as:
 * <ul>
 *     <li>The view</li>
 *     <li>The column index</li>
 *     <li>The row index</li>
 *     <li>The row data record</li>
 *     <li>The data record's model class</li>
 *     <li>The column header</li>
 *     <li>The row element (html)</li>
 *     <li>The cell element (html)</li>
 * </ul>
 *
 * Using this unified identification instance, extending and implementing
 * spreadsheets is much simpler than standard Ext JS grids.
 *
 * Before using a Position instance, please call update() to ensure all
 * references to be valid.
 */
Ext.define('Spread.selection.Position', {

    /**
     * @property {Spread.grid.View} view
     * View instance the position belongs to
     */
    view: null,

    /**
     * @property {Number} column
     * Column index, the position belongs to
     */
    column: -1,

    /**
     * @property {Number} row
     * Row index, the position belongs to
     */
    row: -1,

    /**
     * @property {Ext.data.Model} record
     * Data record (instance of Ext.data.Model) the position belongs to (in store).
     * If not given, this will be auto-detected.
     */
    record: null,

    /**
     * @property {Function} model
     * Reference to the model class constructor of the record of the position.
     * If not given, this will be auto-detected.
     */
    model: null,

    /**
     * @property {Ext.grid.column.Column} columnHeader
     * Column instance (header) the position belongs to.
     * If not given, this will be auto-detected.
     */
    columnHeader: null,

    /**
     * @property {HTMLElement} rowEl
     * Row element instance <tr>, the position belongs to.
     * If not given, this will be auto-detected.
     */
    rowEl: null,

    /**
     * @property {HTMLElement} cellEl
     * Cell element instance <td>, the position belongs to.
     * If not given, this will be auto-detected.
     */
    cellEl: null,

    /**
     * Creates a position object which points to a cell position, record, column-header
     * and view reference. For performance reasons, try to call this function with all
     * arguments. More arguments given, means less auto detection effort.
     * @param {Spread.grid.View} view Spread view instance reference
     * @param {Number} columnIndex Column index
     * @param {Number} rowIndex Row index
     * @param {Ext.data.Model} [record=auto-detect] Data record instance
     * @param {HTMLElement} [rowEl=auto-detect] Row's HTML element (tr-element)
     * @param {HTMLElement} [cellEl=auto-detect] Cell's HTML element (td-element)
     * @return {Object}
     */
    constructor: function(view, columnIndex, rowIndex, record, rowEl, cellEl) {

        //console.log('instantiation of Position', arguments);

        // Correct row and column index if outside of possible grid boundings
        var maxRowCount = view.getStore().getCount(),
            maxColumnCount = view.headerCt.getGridColumns(true).length

        // Column boundary protection
        if (columnIndex >= maxColumnCount) {
            columnIndex = (maxColumnCount-1);
        }

        // Row boundary protection
        if (rowIndex >= maxRowCount) {
            rowIndex = (maxRowCount-1);
        }

        var rowEl = rowEl || view.getNode(rowIndex),
            record = record || view.getStore().getAt(rowIndex),
            model = null;

        // Try to auto-detect
        if (rowEl) {
            cellEl = cellEl || rowEl.childNodes[columnIndex];
        } else {
            cellEl = cellEl || null;
        }

        // If record was given or detected, map it's model reference
        if (record) {
            model = record.self;
        }

        //console.log('TRY FETCH ROW td', rowEl);
        //console.log('TRY FETCH CELL td', cellEl);

        Ext.apply(this, {
            view: view,
            column: columnIndex,
            row: rowIndex,
            record: model,
            model: record ? record.self : undefined,
            columnHeader: view.getHeaderAtIndex(columnIndex),
            rowEl: rowEl,
            cellEl: cellEl
        });
    },

    /**
     * (Re)validates the position object and it's internal references.
     * This is useful when view has been refreshed and record or
     * cell or row of the position has been changed.
     * @return {Spread.selection.Position}
     */
    validate: function() {

        this.record = this.view.getStore().getAt(this.row);

        // If record was given or detected, map it's model reference
        if (this.record) {
            this.model = this.record.self;
        } else {
            this.model = null;
        }

        // Assign updated values/references
        this.columnHeader = this.view.getHeaderAtIndex(this.column);
        this.rowEl = this.view.getNode(this.row);

        if (this.rowEl) {
            this.cellEl = this.rowEl.childNodes[this.column];
        }
        //console.log('Position update()ed ', this);

        return this;
    },

    /**
     * Get field name by fetching the dataIndex
     * of a given column index from column header container of the view.
     * @return {String}
     */
    getFieldName: function() {

        var me = this,
            header = me.view.getHeaderAtIndex(me.column);

        if (header) {
            return header.dataIndex;
        } else {
            throw "No column found for column index: " + me.column;
        }
    },

    /**
     * Returns the primitive type of the position.
     * Returns either: auto, int, float, bool, string or date.
     * @return {String}
     */
    getType: function() {

        var me = this,
            type = 'auto',
            fieldName = me.getFieldName();

        // Caching type name on record instance
        if (!me.record['__' + fieldName + '_type']) {

            me.record.fields.each(function(field) {

                // Found the field and it's special type
                if (field.name === fieldName &&
                    field.type.type !== 'auto') {

                    type = field.type.type;
                }
            });
            return me.record['__' + fieldName + '_type'] = type;
        }
        return me.record['__' + fieldName + '_type'];
    },

    /**
     * Casts a new value into the primitive type
     * needed by the position's under-laying model.
     * @param {String} newValue New value
     * @return {*}
     */
    castNewValue: function(newValue) {

        var me = this;

        // null or undefined
        if (!Ext.isDefined(newValue) || newValue === null) {
            return newValue;
        }

        // Do casting
        switch(me.getType()) {
            case 'bool':
                return (newValue == 'true');
            case 'int':
                return parseInt(newValue);
            case 'float':
                return parseFloat(newValue);
            case 'auto':
            case 'string':
                return newValue.valueOf();
            case 'date':
                return new Date(newValue);
        }
    },

    /**
     * Returns, what Ext.data.Model's set() returns.
     * (An array of modified field names or null if nothing was modified)
     *
     * @param {Mixed} newValue New cell value
     * @param {Boolean} [autoCommit=false] Should the record be automatically committed after change
     * @param {Boolean} [useInternalAPIs=false] Force to use the internal Model API's
     * @return {String}
     */
    setValue: function(newValue, autoCommit, useInternalAPIs) {

        var me = this,
            fieldName,
            ret;


        // Update position
        me.validate();

        if (!autoCommit && !me.columnHeader.autoCommit) {
            //useInternalAPIs = true;
        }

        // Fetch field name
        fieldName = me.getFieldName();

        if (!me.record) {
            throw "No record found for row index: " + me.row;
        }

        // Check for pre-processor
        if (me.columnHeader.cellwriter &&
            Ext.isFunction(me.columnHeader.cellwriter)) {

            // Call pre-processor for value writing / change before write
            newValue = me.columnHeader.cellwriter(newValue, me);

        } else {

            // Auto-preprocessor (type conversion)

            // Casting the new value from text received from
            // the text input field into the origin data type
            newValue = me.castNewValue(newValue);
        }

        // Do not change the record's value if it hasn't changed
        if (me.record.get(fieldName) == newValue) {
            return newValue;
        }

        if (useInternalAPIs) {

            ret = me.record[
                me.record.persistenceProperty
            ][fieldName] = newValue;

            // Set record dirty
            me.record.setDirty();

        } else {

            // Set new value
            ret = me.record.set(fieldName, newValue);
        }
        // Automatically commit if wanted
        if (autoCommit &&
            me.columnHeader.autoCommit) {

            me.record.commit();
        }
        return ret;
    },

    /**
     * Returns the value of the position
     * @return {*}
     */
    getValue: function() {

        var me = this,
            fieldName, value;

        // Update position
        me.validate();

        // Fetch field name
        fieldName = me.getFieldName();

        if (!me.record) {
            throw "No record found for row index: " + me.row;
        }

        // Fetch raw value
        value = me.record.get(fieldName);

        // Check for pre-processor
        if (me.columnHeader.cellreader &&
            Ext.isFunction(me.columnHeader.cellreader)) {

            // Call pre-processor for value reading
            value = me.columnHeader.cellreader(value, me);
        }
        return value;
    }
});
/**
 * @class Spread.selection.RangeModel
 *
 * The instance of this selection model can be fetched by a call of the method
 * getSelectionModel() on a spreadsheet's grid or view instance.
 *
 * This selection model is able to focus cells and select ranges of cells.
 * It implements the logic of selection by:
 * <ul>
 *     <li>click-mouse-drag cell range selection</li>
 *     <li>click-mouse, press shift key, click cell range selection</li>
 *     <li>navigate and focus by keys UP, DOWN, LEFT, RIGHT, TAB, ENTER</li>
 *     <li>press shift key and navigate by key cell range selection</li>
 *     <li>...and all of them in combination</li>
 * </ul>
 *
 * Using the interceptable eventing of this selection model, it's possible
 * to extend the selection and focussing logic.
 *
 * TODO: Select cell on click / key nav -> allows clearing by DEL directly!
 */
Ext.define('Spread.selection.RangeModel', {

    extend: 'Ext.selection.Model',

    requires: ['Spread.selection.Range'],

    alias: 'selection.range',

    isRangeModel: true,

    // Internal indicator flag
    initialViewRefresh: true,

    // Internal indicator flag
    dataChangedRecently: false,

    // Internal keyNav reference
    keyNav: null,

    // Internal indicator flag
    keyNavigation: false,

    // Internal indicator flag
    mayRangeSelecting: false,

    /**
     * @property {Spread.selection.Position}
     * Dynamically calculated root position (initial focus position)
     */
    rootPosition: null,

    /**
     * @cfg {Boolean} autoFocusRootPosition
     * Automatically focusses the root position initially
     */
    autoFocusRootPosition: true,

    /**
     * @cfg {Boolean} enableKeyNav
     * Turns on/off keyboard navigation within the grid.
     */
    enableKeyNav: true,

    /**
     * @property {Spread.selection.Range}
     * Internal array which contains all
     * position objects, identifying the current
     * range of selected cells.
     */
    currentSelectionRange: Ext.create('Spread.selection.Range'),

    /**
     * @property {Spread.selection.Position}
     * Internal reference to the origin
     * selection position object identifying the cell:
     * - where the user clicked without shift pressed
     * - clicked the first time, before extending the range via shift + mouse drag
     * - moved to via key (up, down, left, right) without shift pressed
     * - moved to the first time via key before shift + key was pressed to extend the range
     */
    originSelectionPosition: null,

    /**
     * @property {Spread.selection.Position}
     * Internal reference to the last/current focus position,
     * which means the positioning object of the cell,
     * an event like mouseup or keyup was fired on the last time.
     */
    currentFocusPosition: null,

    /**
     * @property {Spread.grid.View} Internal view instance reference
     */
    view: null,


    /**
     * @property {Spread.grid.Panel} Internal grid reference
     */
    grid: null,

    /**
     * @private
     */
    constructor: function() {

        this.addEvents(

            /**
             * @event deselect
             * Fired after a cell range is deselected
             * @param {Spread.selection.RangeModel} this
             * @param {Array} range Array of selection positions identifying cells
             */
            'deselect',

            /**
             * @event select
             * Fired after a cell range is selected
             * @param {Spread.selection.RangeModel} this
             * @param {Array} range Array of selection positions identifying cells
             */
            'select',

            /**
             * @event beforecellfocus
             * Fired before a cell gets focussed
             * @param {Spread.selection.RangeModel} this
             * @param {Spread.selection.Position} position Cell position object reference
             */
            'beforecellfocus',

            /**
             * @event cellfocus
             * Fired after a cell has been focussed
             * @param {Spread.selection.RangeModel} this
             * @param {Spread.selection.Position} position Cell position object reference
             */
            'cellfocus',

            /**
             * @event cellblur
             * Fired when a cell blur event happens
             * @param {Spread.selection.RangeModel} this
             * @param {Ext.dom.Element} el Element clicked on
             */
            'cellblur',

            /**
             * @event tabselect
             * Fired after TAB has been pressed by user to focus (next) cell
             * @param {Spread.selection.RangeModel} this
             * @param {Ext.EventObject} evt Key event
             */
            'tabselect',

            /**
             * @event enterselect
             * Fired after ENTER has been pressed by user to focus (next) cell (below, left below)
             * @param {Spread.selection.RangeModel} this
             * @param {Ext.EventObject} evt Key event
             */
            'enterselect',

            /**
             * @event keynavigate
             * Fired after key navigation happened (up, down, left, right)
             * @param {Spread.selection.RangeModel} this
             * @param {String} direction Direction name
             * @param {Ext.EventObject} evt Key event
             */
            'keynavigate'
        );
        this.callParent(arguments);
    },

    // --- Initialization

    /**
     * @protected
     * Binds the view instance events to be handled inside of this class
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    bindComponent: function(view) {

        var me = this;

        // Internal references
        me.view = view;
        me.grid = me.view.ownerCt;

        // Call parent
        me.callParent(arguments);

        // Initialize the root position
        me.initRootPosition();

        // Bind UI events for interaction handling
        me.bindUIEvents();

        // Initialize key nav if needed
        if (me.enableKeyNav) {
            me.initKeyNav(view);
        }
    },

    /**
     * @protected
     * Builds a root position to point to the top- and left-most cell available
     * @return void
     */
    initRootPosition: function() {

        var columnIndex = 0,
            currentColumnIsNotHeaderColumn = false,
            noNonHeaderColumnFound = false;

        // Look-ahead and increment starting column position until a column is
        // found which is not a header column
        while (!currentColumnIsNotHeaderColumn) {

            if (!this.view.getHeaderAtIndex(columnIndex)) {
                currentColumnIsNotHeaderColumn = true;
                noNonHeaderColumnFound = true;
            }

            if (this.view.getHeaderAtIndex(columnIndex) &&
                this.view.getHeaderAtIndex(columnIndex).selectable) {
                currentColumnIsNotHeaderColumn = true;
            } else {
                columnIndex++;
            }
        }

        // Create an instance of a root position object
        this.rootPosition = new Spread.selection.Position(
            this.view,
            columnIndex,
            0,
            this.view.getStore().getAt(0)
        );
    },

    /**
     * @protected
     * Binds the view instance events to be handled inside of this class
     * @return void
     */
    bindUIEvents: function() {

        var me = this;

        // Catch the view's cell dbl click event
        me.view.on({
            uievent: me.onUIEvent,
            refresh: me.onViewRefresh,
            scope: me
        });

        // Catch grid's events
        me.view.ownerCt.on({
            columnhide: me.reinitialize,
            columnmove: me.reinitialize,
            columnshow: me.reinitialize,
            scope: me
        });

        // On data change (e.g. filtering)
        me.view.store.on('datachanged', function() {

            //console.log('datachanged!');

            // Set indicator flag to reinitialize after store data has been changed
            me.dataChangedRecently = true;
        });

        // Register edit blur handler
        me.initEditBlurHandler();
    },

    /**
     * @protected
     * Registers and un-registers a document.body event listener
     * for clicks outside of the view area to stop editing.
     * @return void
     */
    initEditBlurHandler: function() {

        var me = this;

        // Un-register on grid destroy
        me.grid.on('destroy', function() {
            Ext.EventManager.un(document.body, 'mouseup', me.onCellMouseUp);
        });

        // Listen for mouseup globally (stable method to fetch mouseup)
        Ext.EventManager.on(document.body, 'mouseup', me.onCellMouseUp, me/*, {
            buffer: 50
        }*/);
    },

    /**
     * Re-initializes focus and selection so that column
     * moving, showing and hiding isn't an issue.
     * @return void
     */
    reinitialize: function() {

        //console.log('reinitialize!');

        // Reset root position
        this.initRootPosition();

        // Auto-focus the root position initially
        try {

            // This may fail due to non-rendered circumstances
            this.setCurrentFocusPosition(this.rootPosition);

        } catch (e) {}

        // Set the origin to the root position too
        this.setOriginSelectionPosition(this.rootPosition);
    },

    /**
     * @protected
     * Initializes the key navigation for single cell or range selection
     * @param {Spread.grid.View} view View instance
     * @return void
     */
    initKeyNav: function(view) {

        var me = this;

        // Handle not-already-rendered circumstances
        if (!view.rendered) {
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
        }

        // view.el has tabIndex -1 to allow for
        // keyboard events to be passed to it.
        view.el.set({
            tabIndex: -1
        });

        // DO NOT handle input field events to allow
        // left & right caret positioning while editing
        me.keyNav = new Ext.util.KeyNav({
            target: view.el,
            eventName: 'keydown',
            ignoreInputFields: true,
            right: me.onKeyRight,
            left: me.onKeyLeft,
            scope: me
        });

        // DO handle input field events
        me.keyNav = new Ext.util.KeyNav({
            target: view.el,
            eventName: 'keydown',
            ignoreInputFields: false,
            up: me.onKeyUp,
            down: me.onKeyDown,
            tab: me.onKeyTab,
            enter: me.onKeyEnter,
            scope: me
        });
    },

    // --- Event handler

    /**
     * @protected
     * Gets called when view gets refereshed
     * @return void
     */
    onViewRefresh: function() {

        //console.log('view refresh happened');

        if (this.dataChangedRecently) {

            // Reset root position
            this.reinitialize();

            // Reset flag
            this.dataChangedRecently = false;

        } else {

            // Update root position / record reference
            this.rootPosition.validate();

            try {
                // Try re-focussing
                this.view.getEl().focus();
            } catch(e) {}
        }

        // May auto-focus root position
        if (this.autoFocusRootPosition && this.initialViewRefresh) {

            // Auto-focus the root position initially
            try {

                // This may fail due to non-rendered circumstances
                this.setCurrentFocusPosition(this.rootPosition);

            } catch (e) {}

            // Set the origin to the root position too
            this.setOriginSelectionPosition(this.rootPosition);

            // Update indicator flag
            this.initialViewRefresh = false;
        }
    },

    /**
     * @protected
     * UI Event processing
     * @param {String} type UI Event type (e.g. 'mousedown')
     * @param {Spread.grid.View} view Spread view instance reference
     * @param {HTMLElement} cell Cell HTML element reference (<td>)
     * @param {Number} rowIndex Row index
     * @param {Number} cellIndex Cell index
     * @param {Ext.EventObject} evt Event instance
     * @param {Ext.data.Model} record Data record instance
     * @param {HTMLElement} row Row HTML element reference (<tr>)
     * @return void
     */
    onUIEvent: function(type, view, cell, rowIndex, cellIndex, evt, record, row) {

        //console.log('uievent', type);
        var me = this, args = arguments;

        switch(type) {

            case "mouseover":
                me.onCellMouseOver.apply(me, args);
                break;

            case "mousedown":
                me.onCellMouseDown.apply(me, args);
                break;
        }
    },

    /**
     * @protected
     * Gets called when mouse down is detected
     * @param {String} type UI Event type (e.g. 'mousedown')
     * @param {Spread.grid.View} view Spread view instance reference
     * @param {HTMLElement} cell Cell HTML element reference (<td>)
     * @param {Number} rowIndex Row index
     * @param {Number} cellIndex Cell index
     * @param {Ext.EventObject} evt Event instance
     * @param {Ext.data.Model} record Data record instance
     * @param {HTMLElement} row Row HTML element reference (<tr>)
     * @param {Object} eOpts Event options
     * @return void
     */
    onCellMouseDown: function(type, view, cell, rowIndex, cellIndex, evt, record, row, eOpts) {

        //console.log('mouse down happened', arguments);

        // Without eOpts, click wasn't detected on a cell/row
        if (!eOpts) {
            return;
        }

        var position = new Spread.selection.Position(view, cellIndex, rowIndex, record, row, cell);

        // Set current focus position
        if (
            this.setCurrentFocusPosition(position)
        ) {

            // Try to select range, if special key was pressed too
            if (evt.shiftKey && !Spread.util.Key.isStartEditKey(evt)) {

                this.selectFocusRange();

            } else {

                // Set origin position
                this.setOriginSelectionPosition(position);

                // Set the indicator flag that a range may be selected in the future (see onCellMouseOver)
                this.mayRangeSelecting = true;
            }
        }
    },

    /**
     * Returns the next valid row index.
     * If row index may be greater than store size,
     * it returns the last valid row index.
     * @param {Ext.data.Store} store Data store
     * @param {Number} rowIndex Current row index
     * @return {Number}
     */
    getNextRowIndex: function(store, rowIndex) {

        if ((rowIndex+1) < store.getCount()) {
            ++rowIndex;
        }
        return rowIndex;
    },

    /**
     * @protected
     * Gets called when mouse hovers a cell
     * @param {String} type UI Event type (e.g. 'mousedown')
     * @param {Spread.grid.View} view Spread view instance reference
     * @param {HTMLElement} cell Cell HTML element reference (<td>)
     * @param {Number} rowIndex Row index
     * @param {Number} cellIndex Cell index
     * @param {Ext.EventObject} evt Event instance
     * @param {Ext.data.Model} record Data record instance
     * @param {HTMLElement} row Row HTML element reference (<tr>)
     * @return void
     */
    onCellMouseOver: function(type, view, cell, rowIndex, cellIndex, evt, record, row) {

        // When range selection is happening,
        // it's of interest to select responsive
        if (this.mayRangeSelecting) {

            //console.log('cell mouse over', arguments);

            // Set last position
            if (
                this.setCurrentFocusPosition(
                    new Spread.selection.Position(view, cellIndex, rowIndex, record, row, cell)
                )
            ) {

                // Try selecting a range
                this.selectFocusRange();
            }
        }
    },

    /**
     * @protected
     * Gets called when mouseup happens on a grid cell.
     * This handler breaks mouse-dragged range selection by setting the this.mayRangeSelecting flag.
     * @return void
     */
    onCellMouseUp: function(evt, el) {

        this.mayRangeSelecting = false;

        //console.log('cell mouse up -> blur', Ext.get(el));

        // Fire cellblur event
        if (!Ext.get(el).hasCls('spreadsheet-cell-cover') &&
            !Ext.get(el).hasCls('x-grid-cell-inner') &&
            !Ext.get(el).hasCls('spreadsheet-cell-cover-edit-field')) {

            this.fireEvent('cellblur', this, Ext.get(el));
        }
    },

    /**
     * @protected
     * Gets called when arrow UP key was pressed
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    onKeyUp: function(evt) {

        if (!this.getCurrentFocusPosition()) return;

        this.keyNavigation = true;
        this.processKeyNavigation('up', evt);
        this.keyNavigation = false;
    },

    /**
     * @protected
     * Gets called when arrow DOWN key was pressed
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    onKeyDown: function(evt) {

        if (!this.getCurrentFocusPosition()) return;

        this.keyNavigation = true;
        this.processKeyNavigation('down', evt);
        this.keyNavigation = false;
    },

    /**
     * @protected
     * Gets called when arrow LEFT key was pressed
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    onKeyLeft: function(evt) {

        if (Ext.get(evt.getTarget()).hasCls('spreadsheet-cell-cover-edit-field')) {
            return;
        }

        if (!this.getCurrentFocusPosition()) return;

        this.keyNavigation = true;
        this.processKeyNavigation('left', evt);
        this.keyNavigation = false;

    },

    /**
     * @protected
     * Gets called when arrow RIGHT key was pressed
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    onKeyRight: function(evt) {

        if (Ext.get(evt.getTarget()).hasCls('spreadsheet-cell-cover-edit-field')) {
            return;
        }

        if (!this.getCurrentFocusPosition()) return;

        this.keyNavigation = true;
        this.processKeyNavigation('right', evt);
        this.keyNavigation = false;

    },

    /**
     * @protected
     * Gets called when TAB key was pressed
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    onKeyTab: function(evt) {

        // Do not handle key event if no focus is given
        if (!this.getCurrentFocusPosition() || !evt) return;

        // Fire event
        this.fireEvent('tabselect', this, evt);

        // Set tab pressed flag
        //this.tabPressedRecently = true;

        //console.log('onKeyTab', evt);

        this.keyNavigation = true;

        if (!evt.shiftKey) {
            this.processKeyNavigation('right', evt);
        } else {
            this.processKeyNavigation('left', evt);
        }
        this.keyNavigation = false;
    },

    /**
     * @protected
     * Gets called when ENTER key was pressed
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    onKeyEnter: function(evt) {

        // Do not handle key event if no focus is given
        if (!this.getCurrentFocusPosition()) return;

        // Fire event
        this.fireEvent('enterselect', this, evt);

        // Standard move-down on ENTER
        this.keyNavigation = true;
        this.processKeyNavigation('down', evt);
        this.keyNavigation = false;
    },

    // --- Selection logic / algorithms

    /**
     * Tries to focus a cell position
     * @param {Spread.selection.Position} position Position object reference
     * @return void
     */
    setCurrentFocusPosition: function(position) {

        // Remove last focus reference
        if (!position) {
            this.currentFocusPosition = null;
            return false;
        }

        // Never allow to focus a cell/position which resists inside a header column
        if (!position.columnHeader.selectable) {
            return false;
        }

        //console.log('[before] setCurrentFocusPosition ', position);

        // Focus is stoppable if a listener returns false / stops the event
        if (this.fireEvent('beforecellfocus', position) !== false) {

            //console.log('setCurrentFocusPosition ', position);

            // Set internal reference
            this.currentFocusPosition = position;

            //console.log('try to focus the position: ', position);

            //console.log('FOCUS ', this.getCurrentFocusPosition().row + ',' + this.getCurrentFocusPosition().column);

            // Reset current selection range
            this.currentSelectionRange = Ext.create('Spread.selection.Range');

            // Inform the view to focus the cell
            this.view.coverCell(position);

            // Fire event
            this.fireEvent('cellfocus', position);

            return true;
        }
        return false;
    },

    /**
     * Returns the last focus position
     * @return {Spread.selection.Position}
     */
    getCurrentFocusPosition: function() {
        return this.currentFocusPosition;
    },

    /**
     * Sets the origin selection position
     * @param {Spread.selection.Position} position Position object reference
     * @return void
     */
    setOriginSelectionPosition: function(position) {

        //console.log('setORIGINSelectionPosition', position);

        // Set internal reference
        this.originSelectionPosition = position;
    },

    /**
     * Returns the origin selection position
     * @return {Spread.selection.Position}
     */
    getOriginSelectionPosition: function() {
        return this.originSelectionPosition;
    },

    /**
     * @protected
     * Processes any key navigation. Therefore receives a (already filtered) key event
     * and a direction to move to (from already given this.currentFocusPosition and this.originSelectionPosition).
     * @param {String} direction Direction to jump/extend range to
     * @param {Ext.EventObject} evt Key event object
     * @return void
     */
    processKeyNavigation: function(direction, evt) {

        setTimeout(Ext.Function.bind(function() {

            // Fire event
            this.fireEvent('keynavigate', this, direction, evt);

            //console.log('processKeyNavigation: ', direction);

            var newCurrentFocusPosition = this.tryMoveToPosition(
                this.getCurrentFocusPosition(), direction, evt
            );

            //console.log('Focus single cell; Reset current range selection.');

            // Focus a new position
            if (
                this.setCurrentFocusPosition(newCurrentFocusPosition)
            ) {

                // Try to select range, if special key was pressed too
                // Shift + Tab is special navigation behaviour (left navigation without selection)
                if (evt.shiftKey && evt.getKey() !== evt.TAB) {

                    this.selectFocusRange();

                } else {

                    // Set origin position
                    this.setOriginSelectionPosition(
                        newCurrentFocusPosition
                    );
                }
            }
        }, this), 50);
    },

    /**
     * @protected
     * Tries to move to a position starting at this.currentFocusPosition
     * and moving on into direction (next cell). If this isn't possible,
     * this method returns the this.currentFocusPosition, otherwise, it
     * returns the position object of the next cell.
     * @param {Object} currentFocusPosition Position object reference
     * @param {String} direction Direction to jump/extend range to
     * @param {Ext.EventObject} evt Key event object
     * @return {Object}
     */
    tryMoveToPosition: function(currentFocusPosition, direction, evt) {

        var newPosition = this.view.walkCells(currentFocusPosition, direction, evt, true);

        //console.log('tryMoveToPosition, newPosition: ', newPosition);

        // When right end is reached, go to row below, first allowed column
        if (!newPosition && !evt.shiftKey && direction === 'right') {

            // Jump to next row, starting column
            newPosition = new Spread.selection.Position(
                currentFocusPosition.view,
                this.rootPosition.column,
                this.getNextRowIndex(
                    currentFocusPosition.view.getStore(),
                    currentFocusPosition.row
                )
            );

        } else if (!newPosition) {

            // But normally, stay where you are
            newPosition = currentFocusPosition;
        }

        // Build a valid position object
        return new Spread.selection.Position(this.view, newPosition.column, newPosition.row);
    },


    /**
     * @protected
     * Creates a range of positions from _previously_ internally set
     * this.originSelectionPosition and (to) this.currentFocusPosition.
     * @return {Spread.selection.Range}
     */
    createFocusRange: function() {

        // private method to interpolate numbers and return them as index array
        var interpolate = function(startIdx, endIdx) {
            var indexes = [];
            do {
                indexes.push(startIdx);
                startIdx++;
            } while(startIdx <= endIdx);

            return indexes;
        };

        //console.log('createFocusRange: ', this.getOriginSelectionPosition(), ' to ', this.getCurrentFocusPosition());

        /*
        console.log('SELECT RANGE FROM ', this.getOriginSelectionPosition().row + ',' + this.getOriginSelectionPosition().column,
                    ' TO ', this.getCurrentFocusPosition().row + ',' + this.getCurrentFocusPosition().column);
        */

        var rowCount = this.view.getStore().getCount(),
            columnCount = this.view.headerCt.getGridColumns(true).length,
            originRow = this.getOriginSelectionPosition().row,
            focusRow = this.getCurrentFocusPosition().row,
            originColumn = this.getOriginSelectionPosition().column,
            focusColumn = this.getCurrentFocusPosition().column,
            rowIndexes = [],
            columnIndexes = [],
            selectedPositions = [],
            selPosition = null;

        // Interpolate selected row indexes
        if (focusRow <= originRow) {
            rowIndexes = interpolate(focusRow, originRow);
        } else {
            rowIndexes = interpolate(originRow, focusRow);
        }

        // Interpolate selected column indexes
        if (focusColumn <= originColumn) {
            columnIndexes = interpolate(focusColumn, originColumn);
        } else {
            columnIndexes = interpolate(originColumn, focusColumn);
        }

        //console.log('selectedRows', rowIndexes, 'selectedColumns', columnIndexes);

        // Walk cells of grid and check for being in selected range
        for (var rowIndex=0; rowIndex<rowCount; rowIndex++) {

            for (var colIndex=0; colIndex<columnCount; colIndex++) {

                // Match positioning indexes
                if (Ext.Array.indexOf(rowIndexes, rowIndex) > -1 &&
                    Ext.Array.indexOf(columnIndexes, colIndex) > -1) {

                    // Fetch already-updated position instance
                    selPosition = new Spread.selection.Position(this.view, colIndex, rowIndex).validate();

                    // Only add position to selection if column isn't hidden currently
                    if (!selPosition.columnHeader.hidden) {
                        selectedPositions.push(selPosition);
                    }
                }
            }
        }

        return Ext.create('Spread.selection.Range', {
            positions: selectedPositions
        });
    },


    /**
     * @protected
     * Tries to select a range by information from _previously_ internally set
     * this.originSelectionPosition and (to) this.currentFocusPosition.
     * @param {Boolean} [virtual=false] Virtual calculation but no UI change
     * @return void
     */
    selectFocusRange: function(virtual) {

        // Update local selection range cache
        this.currentSelectionRange = this.createFocusRange();

        // Select the range
        this.currentSelectionRange.select(this, virtual);
    },

    /**
     * Returns the currently focussed cell data or selected range data
     * (like represented in grid itself).
     * @return {Array}
     */
    getSelectedPositionData: function() {

        var selectionToTransform;

        if (this.currentSelectionRange.count() === 0) {
            selectionToTransform = [this.currentFocusPosition];
        } else {
            selectionToTransform = this.currentSelectionRange.toArray();
        }
        //console.log('transform to array', selectionToTransform);

        return selectionToTransform;
    },

    /**
     * Returns the current selection range
     * @return {Spread.selection.Range}
     */
    getCurrentSelectionRange: function() {
        return this.currentSelectionRange;
    }
});
/**
 * @class Spread.util.Key
 * Utility class to determine key codes and possible actions to happen.
 */
Ext.define('Spread.util.Key', {

    singleton: true,

    // Internal flag
    specialKeyPressedBefore: null,

    /**
     * Checks for key code to if editing should be canceled
     * @param {Ext.EventObject} evt Event object instance
     * @return {Boolean}
     */
    isCancelEditKey: function(evt) {

        var k = evt.normalizeKey(evt.keyCode);

        return ((k >= 33 && k <= 40) && k != 37 && k != 39) ||  // Page Up/Down, End, Home, Up, Down
            k == evt.RETURN ||
            k == evt.TAB ||
            k == evt.ESC ||
            k == 91 || // Windows key
            (!Ext.isIE && k === 224)
    },

    /**
     * Checks for key code to if editing should begin
     * @param {Ext.EventObject} evt Event object instance
     * @return {Boolean}
     */
    isStartEditKey: function(evt) {

        var me = this,
            k = evt.normalizeKey(evt.keyCode);

        //console.log('isStartEditKey?', k, evt.ctrlKey);

        if (me.specialKeyPressedBefore) {
            me.specialKeyPressedBefore = false;
            return false;
        }

        // Do never start editing when CTRL or CMD was pressed
        // Or last key was 91 in IE (windows key) and now someone presses a different key
        if (evt.ctrlKey) {
            return false;
        }

        // Windows key in IE is a special key
        if (Ext.isIE && k === 91) {
            me.specialKeyPressedBefore = true;
        }

        return (k >= 48 && k <= 57) || // 0-9
               (k >= 65 && k <= 90) || // a-z
               (k >= 96 && k <= 111) || // numpad keys
               (k >= 173 && k <= 222)
    }
});
/**
 * @class Spread.util.TSVTransformer
 * @private
 * Internal class for transforming data pasted from native spreadsheet applications to TSV and back.
 */
Ext.define('Spread.util.TSVTransformer', {

    singleton: true,

    /**
     * @property {String} lineSeparator
     * Line separator char sequence
     */
    lineSeparator: '\n',

    /**
     * @property {String} columnSeparator
     * Column separator char sequence
     */
    columnSeparator: '\t',

    /**
     * Transforms plain array data into TSV plaintext
     * @param {Array} selectionPositions Array of selected position instances
     * @return {String}
     */
    transformToTSV: function(selectionPositions) {

        var currentRow = -1,
            tsvText = '';

        //console.log('transformToTSV', selectionPositions);

        // Loop to already well-ordered array
        for (var i=0; i<selectionPositions.length; i++) {

            // Update record first
            selectionPositions[i].validate();

            // Add line break
            if (currentRow !== selectionPositions[i].row &&
                currentRow !== -1) {

                if (tsvText[tsvText.length-1] == this.columnSeparator) {
                    tsvText = tsvText.substring(0, tsvText.length - 1); // Remove trailing tabulator
                }
                tsvText = this.addLineBreak(tsvText);
            }
            currentRow = selectionPositions[i].row;

            // Add cell value
            tsvText = this.addValue(tsvText, selectionPositions[i]);

            // Add tabulator
            if (selectionPositions[i+1] &&
                selectionPositions[i+1].column !== selectionPositions[+1].view.getSelectionModel().rootPosition.column) {
                tsvText = this.addTabulator(tsvText);
            }
        }
        tsvText = this.addLineBreak(tsvText);

        return tsvText;
    },

    /**
     * Transforms pasted TSV data into plain array data
     * @param {String} clipboardData Pasted TSV or Excel plain clipboard data
     * @return {Array}
     */
    transformToArray: function(clipboardData) {

        var dataArray = [],
            rows = clipboardData.split(this.lineSeparator);

        for (var i=0; i<(rows.length-1); i++) {
            dataArray.push(
                rows[i].split(this.columnSeparator)
            );
        }
        return dataArray;
    },

    /**
     * Adds line break chars to buffer
     * @param {String} tsvText Current buffer
     * @return {String}
     */
    addLineBreak: function(tsvText) {
        return tsvText + this.lineSeparator;
    },

    /**
     * Adds a tabulator char to buffer
     * @param {String} tsvText Current buffer
     * @return {String}
     */
    addTabulator: function(tsvText) {
        return tsvText + this.columnSeparator;
    },

    /**
     * Adds the value to the buffer
     * @param {String} tsvText Current buffer
     * @param {Spread.selection.Position} position Position reference
     * @return {String}
     */
    addValue: function(tsvText, position) {
        return tsvText += position.getValue();
    }
});
