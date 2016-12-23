(function() {
  window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Templates: {},
    globalPath: {}
  };

}).call(this);

(function() {
  App.Templates.mapTpl = "<div class=\"map\" id=\"js-map\"></div>";

  App.Templates.mapTypesTpl = "<ul class=\"map-menu-list\">\n  <li class='check-menu-buttons'>\n    <button type=\"button\" id=\"js-set-all-btn\" class=\"btn btn-xs btn-primary\">\n      Check All <span class=\"glyphicon glyphicon-check\" aria-hidden=\"true\"></span>\n    </button>\n    <button type=\"button\" id=\"js-unset-all-btn\" class=\"btn btn-xs btn-primary\">\n      Uncheck <span class=\"glyphicon glyphicon-unchecked\" aria-hidden=\"true\"></span>\n    </button>\n  </li>\n  <li class='map-menu-buttons'>\n    <button type=\"button\" class=\"btn btn-primary add-btn\">Add</button>\n    <button type=\"button\" class=\"btn btn-primary draw-btn\">Show</button>\n    <button type=\"button\" class=\"btn btn-default cancel-btn\">Cancel</button>\n  </li>\n  <li class='add-new-type-button'>\n    <button type=\"button\" class=\"btn btn-primary add-new-type-btn\">\n      Type <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\n    </button>\n  </li>\n</ul>\n<div class=\"show-btn\" id=\"js-show-menu\"></div>";

  App.Templates.mapTypesItemTpl = "<li class=\"map-menu-item\" data-type=\"<%= type_id %>\">\n  <span class='part-icon <%= type %>'></span>\n  <span class='type'><%= type %></span>\n  <span class=\"badge\"><%= count %></span>\n</li>";

  App.Templates.mapAddAlertTpl = "<div id=\"js-marker-alert\" class=\"alert add-marker-alert alert-info\" role=\"alert\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n  Please, click on map to add a new marker.\n</div>";

  App.Templates.addTpl = "";

  App.Templates.popupTpl = "<div class=\"header\">\n  <span>\n    <%= title %>\n  </span>\n  <button type=\"button\" class=\"close\">&times;</button>\n</div>\n<div>\n  <%= description %>\n</div>";

  App.Templates.contextMenuTpl = "<ul>\n  <li class=\"edit\">Edit</li>\n  <li class=\"delete\">Delete</li>\n</ul>";

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.MarkerModel = (function(superClass) {
    extend(MarkerModel, superClass);

    function MarkerModel() {
      return MarkerModel.__super__.constructor.apply(this, arguments);
    }

    MarkerModel.prototype.defaults = {
      active: true,
      debug: false,
      enableDrag: false,
      parent: null,
      view: null,
      type: null,
      type_id: null,
      px_offset_x: 16,
      px_offset_y: 46,
      markerTop: null,
      markerLeft: null,
      projection: null,
      lat: null,
      lng: null
    };

    MarkerModel.prototype.initialize = function(options) {
      this.options = options || null;
      this.on('add_to_collection', this.insertIntoCollection);
      this.on("change:type", function() {});
      if (this.collection) {
        this.set('parent', this.collection.parent);
      }
      if (!this.options.preview) {
        this.updateModel();
      }
      this.set({
        types: this.options.type,
        px_offset_x: _.isNull(this.options.px_offset_x) ? this.options.type[0].px_offset_x : this.get('px_offset_x'),
        px_offset_y: _.isNull(this.options.px_offset_y) ? this.options.type[0].px_offset_y : this.get('px_offset_y')
      }, {
        silent: true
      });
    };

    MarkerModel.prototype.removeFromCollection = function() {
      this.collection.remove(this);
    };

    MarkerModel.prototype.insertIntoCollection = function() {
      this.collection.add(this);
    };

    MarkerModel.prototype.updateModel = function() {
      var category, trigger;
      category = this.get('parent').getActiveCategory();
      trigger = (function(_this) {
        return function() {
          return _this.trigger('showCustomType', _this);
        };
      })(this);
      if (category) {
        _.each(this.options.type, (function(_this) {
          return function(el, key) {
            var active, i, index, len, results;
            results = [];
            for (index = i = 0, len = category.length; i < len; index = ++i) {
              active = category[index];
              if (el.id === parseInt(active)) {
                _this.set({
                  type: el.type,
                  type_id: el.id
                }, {
                  silent: true
                });
                results.push(_.defer(trigger));
              } else {
                results.push(void 0);
              }
            }
            return results;
          };
        })(this));
      } else {
        this.set({
          type: this.options.type[0].type,
          type_id: this.options.type[0].id
        }, {
          silent: true
        });
      }
    };

    MarkerModel.prototype.updateMarkerDynamickCoords = function() {
      var containerPixels;
      containerPixels = this.get('projection').fromLatLngToContainerPixel(new google.maps.LatLng(this.get('lat'), this.get('lng'))) || null;
      this.set({
        markerTop: containerPixels.y,
        markerLeft: containerPixels.x
      }, {
        silent: true
      });
    };

    MarkerModel.prototype.createPopup = function() {
      var parent;
      parent = this.get('parent');
      parent.set('popupModel', new App.Models.PopupModel({
        parent: this.get('parent'),
        marker: this
      }));
      parent.set('popupView', new App.Views.PopupView({
        model: this.get('parent').get('popupModel')
      }));
    };

    MarkerModel.prototype.createContext = function() {
      var parent;
      parent = this.get('parent');
      parent.set('contextModel', new App.Models.ContextMenuModel({
        parent: this.get('parent'),
        marker: this
      }));
      parent.set('contextView', new App.Views.ContextMenuView({
        model: this.get('parent').get('contextModel')
      }));
    };

    return MarkerModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.MarkerView = (function(superClass) {
    extend(MarkerView, superClass);

    function MarkerView() {
      return MarkerView.__super__.constructor.apply(this, arguments);
    }

    MarkerView.prototype.tagName = 'div';

    MarkerView.prototype.attributes = function() {
      return {
        "class": 'marker' + (!_.isNull(this.model.get('type')) ? ' ' + this.model.get('type') : '')
      };
    };

    MarkerView.prototype.events = {
      "click": "openPopup",
      "contextmenu": "openContext"
    };

    MarkerView.prototype.initialize = function(options) {
      this.options = options || null;
      this.parent = this.model.get('parent');
    };

    MarkerView.prototype.render = function(options) {
      var marker;
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.model.get('lat'), this.model.get('lng')),
        visible: this.model.get('debug') ? true : false,
        map: options.map.get('map'),
        draggable: true
      });
      if (this.model.get('type') && this.model.get('debug') !== true) {
        this.createMarker(marker, {
          container: this.$el,
          offsetX: this.model.get('px_offset_x'),
          offsetY: this.model.get('px_offset_y'),
          title: this.model.get('type') || null,
          map: options.map.get('map') || null
        });
      } else {
        marker.visible = true;
        this.label = marker;
      }
      return this;
    };

    MarkerView.prototype.createMarker = function(marker, params) {
      var _marker, _params, label, scope;
      scope = this;
      _params = params != null ? params : null;
      _marker = marker != null ? marker : null;
      label = function(options) {
        this.setValues(options);
        this.marker = _params.container.html('');
      };
      label.prototype = new google.maps.OverlayView();
      label.prototype.onAdd = function() {
        var pane;
        pane = this.getPanes().overlayMouseTarget;
        this.marker.draggable = true;
        $(pane).append(this.marker);
        google.maps.event.addDomListener(_params.map.getDiv(), 'mouseleave', (function(_this) {
          return function() {
            if (scope.model.get('enableDrag')) {
              return google.maps.event.trigger(_this.marker[0], 'mouseup');
            }
          };
        })(this));
        google.maps.event.addDomListener(this.marker[0], 'mousedown', (function(_this) {
          return function(e) {
            if (scope.model.get('enableDrag')) {
              _this.marker[0].style.cursor = 'move';
              _params.map.set('draggable', false);
              _this.set('origin', e);
              return _this.moveHandler = google.maps.event.addDomListener(_params.map.getDiv(), 'mousemove', function(e) {
                var divPixel, latLng, left, origin, top;
                origin = _this.get('origin');
                left = origin.clientX - e.clientX;
                top = origin.clientY - e.clientY;
                divPixel = _this.getProjection().fromLatLngToDivPixel(_this.get('position'));
                latLng = _this.getProjection().fromDivPixelToLatLng(new google.maps.Point(divPixel.x - left, divPixel.y - top));
                _this.set('origin', e);
                _this.set('position', latLng);
                return _this.draw();
              });
            }
          };
        })(this));
        google.maps.event.addDomListener(this.marker[0], 'mouseup', (function(_this) {
          return function() {
            if (scope.model.get('enableDrag')) {
              _this.marker[0].style.cursor = 'pointer';
              _params.map.set('draggable', true);
              return google.maps.event.removeListener(_this.moveHandler);
            }
          };
        })(this));
      };
      label.prototype.onRemove = (function(_this) {
        return function() {
          return _this.$el.remove();
        };
      })(this);
      label.prototype.getDraggable = function() {
        return false;
      };
      label.prototype.getPosition = function() {
        return this.get('position');
      };
      label.prototype.draw = function() {
        var divPixel, styles;
        divPixel = this.getProjection().fromLatLngToDivPixel(this.get('position'));
        styles = {
          left: Math.round(divPixel.x - _params.offsetX) + 'px',
          top: Math.round(divPixel.y - _params.offsetY) + 'px'
        };
        scope.model.set({
          'projection': this.getProjection()
        }, {
          silent: true
        });
        this.marker.css(styles);
        if (scope.model.get('enableDrag')) {
          scope.model.set({
            'lat': this.get('position').G,
            'lng': this.get('position').K
          });
        }
      };
      this.label = new label({
        map: _params.map
      });
      this.label.bindTo('position', _marker, 'position');
      this.label.bindTo('visible', _marker, 'visible');
    };

    MarkerView.prototype.openPopup = function(e) {
      var config, popup, ruleTag;
      e.stopPropagation();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      if (!this.model.get('enableDrag')) {
        if (this.parent !== null) {
          this.parent.removePopupIfExists();
          this.parent.removeContextIfExists();
          this.model.updateMarkerDynamickCoords();
          this.model.createPopup();
          popup = this.model.get('parent').getPopup();
          $('#js-map').append(popup.view.render().$el);
          config = popup.view.getWindowPositionFromMarker();
          if (!popup.model.get('mobile')) {
            popup.view.setWindowPosition(config);
            popup.view.$el.addClass(config.arrow_direction + '_direction');
            ruleTag = popup.view.getArrowPosition(config);
            if (ruleTag) {
              $('#js-arrow-correction-rule').remove();
            }
            $('head').append(ruleTag);
          }
        }
      }
    };

    MarkerView.prototype.openContext = function(e) {
      var config, context;
      e.stopPropagation();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      if (!this.model.get('enableDrag')) {
        this.parent.removePopupIfExists();
        this.parent.removeContextIfExists();
        this.model.updateMarkerDynamickCoords();
        this.model.createContext();
        context = this.model.get('parent').getContext();
        $('#js-map').append(context.view.render().$el);
        config = context.view.getContextPositionFromMarker();
        context.view.setContextPosition(config);
      }
    };

    return MarkerView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Collections.MarkerCollection = (function(superClass) {
    extend(MarkerCollection, superClass);

    function MarkerCollection() {
      return MarkerCollection.__super__.constructor.apply(this, arguments);
    }

    MarkerCollection.prototype.model = App.Models.MarkerModel;

    return MarkerCollection;

  })(Backbone.Collection);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.MarkerCollectionView = (function(superClass) {
    extend(MarkerCollectionView, superClass);

    function MarkerCollectionView() {
      return MarkerCollectionView.__super__.constructor.apply(this, arguments);
    }

    MarkerCollectionView.prototype.initialize = function(options) {
      this.options = options || null;
      this.map_model = this.options.collection.parent.get('mapModel');
      this.setElement('.map-container');
      this.parent = this.options.collection.parent;
      this.listenTo(this.collection, "add", this.render);
      this.listenTo(this.collection, "change", this.update);
      this.listenTo(this.collection, "remove", this.remove);
      this.listenTo(this.collection, "showCustomType", this.updateCustomClass);
      this.listenTo(this.collection, "redrawChangedLatLng", function(args) {
        this.remove(args);
        this.render(args);
      });
    };

    MarkerCollectionView.prototype.updateCustomClass = function(args) {
      if (!args.get('view').$el.hasClass(args.get('type'))) {
        args.get('view').$el.removeAttr('class');
        args.get('view').$el.addClass("marker " + (args.get('type')));
      }
    };

    MarkerCollectionView.prototype.hideNonSelectedCategories = function() {
      var active, activeArr, availCount, hide, i, index, len, show;
      activeArr = this.parent.getActiveCategory();
      availCount = 0;
      hide = [];
      show = [];
      _.each(this.parent.get('categories').avail, (function(_this) {
        return function(el) {
          return availCount += el.count;
        };
      })(this));
      if (this.collection.models.length === (availCount - 1)) {
        for (index = i = 0, len = activeArr.length; i < len; index = ++i) {
          active = activeArr[index];
          this.collection.each((function(_this) {
            return function(el, key) {
              var j, len1, ref, typeObj;
              ref = el.get('types');
              for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
                typeObj = ref[index];
                if (typeObj.id !== parseInt(active)) {
                  if (_.indexOf(hide, el) === -1 && _.indexOf(show, el) === -1) {
                    hide.push(el);
                  }
                } else {
                  if (_.indexOf(show, el) === -1) {
                    show.push(el);
                  }
                  if (_.indexOf(hide, el) !== -1) {
                    hide = _.without(hide, el);
                  }
                }
              }
            };
          })(this));
        }
      } else {
        this.parent.updateMarkersCollection();
      }
      this.showAll();
      _.each(hide, (function(_this) {
        return function(el) {
          return _this.remove(el);
        };
      })(this));
    };

    MarkerCollectionView.prototype.showAll = function() {
      var availCount;
      availCount = 0;
      if (this.collection.models.length === availCount - 1) {
        _.each(this.collection.models, (function(_this) {
          return function(el) {
            if (!el.get('active')) {
              _this.render(el);
              return el.set({
                active: true
              }, {
                silent: true
              });
            }
          };
        })(this));
      } else {
        this.parent.updateMarkersCollection();
      }
    };

    MarkerCollectionView.prototype.renderCollection = function() {
      var collection;
      collection = this.options.collection.clone();
      collection.each((function(_this) {
        return function(el, key) {
          var markerView;
          markerView = new App.Views.MarkerView({
            model: el
          });
          markerView.render({
            map: _this.map_model
          });
          el.set({
            view: markerView
          }, {
            silent: true
          });
          if (collection.length - 1 === key) {
            return _this.options.collection.parent.trigger('collection_render');
          }
        };
      })(this));
    };

    MarkerCollectionView.prototype.remove = function(args) {
      var cluster;
      cluster = this.parent.get('cluster');
      if (cluster !== null) {
        cluster.removeMarker(args.get('view').label);
      }
      args.get('view').label.setMap(null);
      args.get('view').remove();
      args.set({
        active: false
      }, {
        silent: true
      });
    };

    MarkerCollectionView.prototype.render = function(args) {
      var cluster, markerView;
      markerView = new App.Views.MarkerView({
        model: args
      });
      cluster = this.parent.get('cluster');
      markerView.render({
        map: this.map_model
      });
      args.set({
        view: markerView
      }, {
        silent: true
      });
      if (cluster !== null) {
        cluster.addMarker(args.get('view').label);
      }
    };

    MarkerCollectionView.prototype.update = function(args) {
      if (args.hasChanged('type')) {
        if (args.get('preview')) {
          this.remove(args);
          this.render(args);
        } else {
          args.updateModel();
        }
      } else {

      }
    };

    return MarkerCollectionView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.MapMenuModel = (function(superClass) {
    extend(MapMenuModel, superClass);

    function MapMenuModel() {
      return MapMenuModel.__super__.constructor.apply(this, arguments);
    }

    MapMenuModel.prototype.defaults = {
      activeCategory: null,
      parent: null,
      collection: null,
      fetchCategoryRoute: ''
    };

    MapMenuModel.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.on('change:activeCategory', function() {
        return this.get('parent').set({
          'activeCategory': this.get('activeCategory')
        });
      });
      return this;
    };

    MapMenuModel.prototype.fetchCollectionByCategory = function() {
      var collection;
      collection = this.get('collection');
      collection.url = this.get('parent').get('location') + this.get('fetchCategoryRoute');
      collection.fetch({
        success: (function(_this) {
          return function(collection, response, options) {};
        })(this),
        error: function(collection, response, options) {
          console.error(response);
        }
      });
    };

    return MapMenuModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.MapMenuView = (function(superClass) {
    extend(MapMenuView, superClass);

    function MapMenuView() {
      return MapMenuView.__super__.constructor.apply(this, arguments);
    }

    MapMenuView.prototype.tagName = 'div';

    MapMenuView.prototype.className = 'map-menu';

    MapMenuView.prototype.menuActive = false;

    MapMenuView.prototype.btnSize = 64;

    MapMenuView.prototype.animation = 300;

    MapMenuView.prototype.events = {
      "click #js-set-all-btn": "setAll",
      "click #js-unset-all-btn": "unsetAll",
      "click .map-menu-item": "setCategory",
      "mouseover .map-menu-item": "showAllMenu",
      "click .add-btn": "addMarkerAction",
      "click .add-new-type-btn": "addNewTypeAction",
      "click .draw-btn": "drawMarkersAction",
      "click .cancel-btn": "cancelMenu",
      "mouseover": "showPartMenu",
      "click .show-btn": "showPartMenu"
    };

    MapMenuView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.parent = this.model.get('parent');
      this.template = _.template(App.Templates.mapTypesTpl);
    };

    MapMenuView.prototype.render = function() {
      var json;
      json = this.model.toJSON();
      this.el.innerHTML = this.template(json);
      return this;
    };

    MapMenuView.prototype.setAll = function() {
      return this.$('.map-menu-item').addClass('active');
    };

    MapMenuView.prototype.unsetAll = function() {
      return this.$('.map-menu-item').removeClass('active');
    };

    MapMenuView.prototype.showAllMenu = function() {
      var btn, menu;
      btn = this.$('#js-show-menu');
      menu = this.$('.map-menu-list');
      this.$el.stop().animate({
        width: 200
      }, this.animation, "linear", (function(_this) {
        return function() {
          return _.defer(function() {
            if (_this.$el.hasClass('show-part')) {
              _this.$el.removeClass('show-part');
            }
            _this.$el.addClass('show-all');
            _this.$('.btn').removeClass('btn-sm');
          });
        };
      })(this));
    };

    MapMenuView.prototype.showPartMenu = function(e) {
      var btn, menu;
      btn = this.$('#js-show-menu');
      menu = this.$('.map-menu-list');
      if (e.type === 'click' && this.menuActive) {
        this.hideMenu();
        return;
      }
      if (!this.menuActive) {
        this.$el.addClass('show-part');
        this.$('.btn').addClass('btn-sm');
        btn.stop().animate({
          right: 0
        }, this.animation, "linear", (function(_this) {
          return function() {
            return btn.addClass('active');
          };
        })(this));
        this.$el.stop().animate({
          right: 0
        }, this.animation, "linear", (function(_this) {
          return function() {
            return _this.menuActive = true;
          };
        })(this));
      }
    };

    MapMenuView.prototype.hideMenu = function() {
      var btn, menu, right;
      btn = this.$('#js-show-menu');
      menu = this.$('.map-menu-list');
      if (this.$el.hasClass('show-all')) {
        right = this.$el.css('width');
      } else {
        right = this.btnSize;
      }
      this.$el.stop().animate({
        right: -(parseInt(right))
      }, this.animation, "linear", (function(_this) {
        return function() {
          _this.$el.removeClass('show-part');
          _this.$el.removeClass('show-all');
          _this.$el.css('width', '');
          return _this.menuActive = false;
        };
      })(this));
      btn.stop().animate({
        right: right
      }, this.animation, "linear", (function(_this) {
        return function() {
          return btn.removeClass('active');
        };
      })(this));
    };

    MapMenuView.prototype.renderMenuItems = function() {
      var activeTypes, categories, collection, params, prop;
      collection = this.model.get('collection');
      categories = this.parent.get('categories').avail;
      this.menu_item_template = _.template(App.Templates.mapTypesItemTpl);
      for (prop in categories) {
        if (!hasProp.call(categories, prop)) continue;
        if (!categories[prop]) {
          continue;
        }
        params = {
          type: prop,
          type_id: categories[prop].type_id,
          count: categories[prop].count
        };
        $(this.menu_item_template(params)).insertBefore(this.$('.map-menu-list .map-menu-buttons'));
      }
      if (this.parent.get('activeCategory')) {
        activeTypes = this.parent.get('activeCategory').split('=')[1].split(',');
        _.each(activeTypes, (function(_this) {
          return function(el) {
            return _this.$("li[data-type='" + el + "']").addClass('active');
          };
        })(this));
      }
      return this;
    };

    MapMenuView.prototype.unrenderMenuItems = function() {
      return this.$(".map-menu-list .map-menu-item").remove();
    };

    MapMenuView.prototype.setCategory = function(e) {
      var category, decode, match, removeIndex, routeParams, search, type, typesParamArr;
      routeParams = {};
      search = /([^&=]+)=?([^&]*)/g;
      decode = function(s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
      };
      type = $(e.currentTarget).data('type');
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      this.parent.removePopupIfExists();
      this.parent.removeContextIfExists();
      this.parent.get('addMarkerMenuView').hideForm();
      category = this.model.get('fetchCategoryRoute').substr(9);
      while (match = search.exec(category)) {
        routeParams[decode(match[1])] = decode(match[2]);
      }
      if (!$(e.currentTarget).hasClass('active')) {
        $(e.currentTarget).addClass('active');
        if (this.model.get('fetchCategoryRoute').length > 0 && routeParams.type) {
          type = type + ',' + routeParams.type;
        }
        this.model.set({
          'fetchCategoryRoute': "/markers/type=" + type + "&" + (this.parent.get('area')),
          'activeCategory': "type=" + type
        });
      } else {
        $(e.currentTarget).removeClass('active');
        typesParamArr = routeParams.type.split(',');
        removeIndex = typesParamArr.indexOf(type.toString());
        typesParamArr.splice(removeIndex, 1);
        if (typesParamArr.length > 0) {
          this.model.set({
            'fetchCategoryRoute': "/markers/type=" + (typesParamArr.join(',')) + "&" + (this.parent.get('area')),
            'activeCategory': "type=" + (typesParamArr.join(','))
          });
        } else {
          this.model.set({
            'fetchCategoryRoute': "/markers/" + (this.parent.get('area')),
            'activeCategory': null
          });
        }
      }
      return this;
    };

    MapMenuView.prototype.addMarkerAction = function(e) {
      var addMarkerId, addMenu, delay, mapModel;
      delay = 1500;
      mapModel = this.parent.get('mapModel');
      addMenu = this.parent.get('addMarkerMenuView');
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      if (!$(e.currentTarget).hasClass('active')) {
        $(e.currentTarget).addClass('active');
        addMarkerId = this.addMarkerAlert();
        _.delay(this.removeMarkerAlert, delay, addMarkerId);
        google.maps.event.addListener(mapModel.get('map'), 'click', (function(_this) {
          return function(event) {
            var attrs;
            attrs = {
              preview: true,
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            if (addMarkerId) {
              _this.removeMarkerAlert(addMarkerId);
            }
            _this.hideMenu();
            addMenu.addPreview(attrs);
            addMenu.setLatLng(attrs);
            addMenu.show_form();
          };
        })(this));
      } else {
        addMenu.hideForm();
      }
    };

    MapMenuView.prototype.drawMarkersAction = function() {
      this.parent.get('markerCollectionView').hideNonSelectedCategories();
    };

    MapMenuView.prototype.addNewTypeAction = function() {
      this.parent.get('addTypeMenuView').show();
    };

    MapMenuView.prototype.cancelMenu = function() {
      this.model.set({
        'fetchCategoryRoute': "/markers/" + (this.parent.get('area')),
        'activeCategory': null
      });
      $('.map-menu-item').removeClass('active');
      this.unsetAll();
      this.hideMenu();
      this.parent.get('markerCollectionView').showAll();
    };

    MapMenuView.prototype.addMarkerAlert = function() {
      $('#js-map').append($(App.Templates.mapAddAlertTpl)[0]);
      return $(App.Templates.mapAddAlertTpl).attr('id');
    };

    MapMenuView.prototype.removeMarkerAlert = function(id) {
      return $("#" + id).remove();
    };

    return MapMenuView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.AddMarkerMenuModel = (function(superClass) {
    extend(AddMarkerMenuModel, superClass);

    function AddMarkerMenuModel() {
      return AddMarkerMenuModel.__super__.constructor.apply(this, arguments);
    }

    AddMarkerMenuModel.prototype.defaults = {
      mobile: null,
      parent: null,
      tmp_model: null,
      action: null
    };

    AddMarkerMenuModel.prototype.initialize = function(options) {
      var md;
      md = new MobileDetect(window.navigator.userAgent);
      this.options = options != null ? options : null;
      this.set('mobile', md.mobile());
    };

    return AddMarkerMenuModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.AddMarkerMenuView = (function(superClass) {
    extend(AddMarkerMenuView, superClass);

    function AddMarkerMenuView() {
      return AddMarkerMenuView.__super__.constructor.apply(this, arguments);
    }

    AddMarkerMenuView.prototype.events = {
      "click .btn": "validateForm",
      "click .close": "hideForm",
      "input.check_errors select[name='type[]']": "check_error_class",
      "input.update_preview select[name='type[]']": "updatePreviewType",
      "input input[name='title']": "check_error_class",
      "input textarea[name='description']": "check_error_class",
      "input input[name='lat']": "check_error_class",
      "input input[name='lng']": "check_error_class"
    };

    AddMarkerMenuView.prototype.tmp_model = null;

    AddMarkerMenuView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.listenTo(this.model, "start_watch_lat_lng_change", this.watchLatLngChange);
      if (this.model.get('mobile')) {
        this.$el.addClass('mobile');
      }
      _.each(this.model.get('parent').get('categories').all, (function(_this) {
        return function(el) {
          return _this.$('#type').append($("<option></option>").attr("value", el.id).text(el.type));
        };
      })(this));
    };

    AddMarkerMenuView.prototype.checkType = function(attrs) {
      var categories, prop, type;
      categories = this.model.get('parent').get('categories').all;
      for (prop in categories) {
        if (!hasProp.call(categories, prop)) continue;
        if (!(categories[prop].id === parseInt(attrs.val))) {
          continue;
        }
        type = categories[prop].type;
        break;
      }
      return type;
    };

    AddMarkerMenuView.prototype.addPreview = function(attrs) {
      var collection, select, tmp_model;
      collection = this.model.get('parent').get('markerCollection');
      select = this.$('select[name=\'type[]\']');
      if (select.val() !== '') {
        attrs.type = this.checkType({
          val: select.val()
        });
      }
      tmp_model = new App.Models.MarkerModel(attrs);
      tmp_model.collection = collection;
      tmp_model.trigger('add_to_collection');
      if (this.tmp_model) {
        this.tmp_model.removeFromCollection();
      }
      this.tmp_model = tmp_model;
    };

    AddMarkerMenuView.prototype.updatePreviewType = function() {
      var select, type;
      select = this.$('select[name=\'type[]\']');
      if (select.val() !== '') {
        type = this.checkType({
          val: select.val()
        });
      }
      if (_.isNull(this.model.get('action'))) {
        this.tmp_model.set('type', type);
      } else {
        this.model.get('parent').get('activeEditMarker').set('type', type, {
          silent: true
        });
        this.model.get('parent').get('activeEditMarker').trigger('showCustomType', this.model.get('parent').get('activeEditMarker'));
      }
    };

    AddMarkerMenuView.prototype.setFields = function(marker) {
      if (marker.get('title')) {
        this.$('#title').val(marker.get('title'));
      }
      if (marker.get('description')) {
        this.$('#description').val(marker.get('description'));
      }
    };

    AddMarkerMenuView.prototype.setType = function(marker) {
      var types;
      types = [];
      _.each(marker.get('types'), (function(_this) {
        return function(el) {
          return types.push(el.id);
        };
      })(this));
      this.$("#type").val(types);
    };

    AddMarkerMenuView.prototype.setLatLng = function(attrs) {
      var lat_input, lng_input;
      lat_input = this.$('input[name=\'lat\']');
      lng_input = this.$('input[name=\'lng\']');
      lat_input.val(attrs.lat);
      lat_input.trigger("input");
      lng_input.val(attrs.lng);
      lng_input.trigger("input");
    };

    AddMarkerMenuView.prototype.check_error_class = function(e) {
      if ($(e.target).parent().hasClass('has-error')) {
        $(e.target).parent().removeClass('has-error');
      }
    };

    AddMarkerMenuView.prototype.show_form = function() {
      this.$el.show("slow", (function(_this) {
        return function() {
          return _this.model.get('parent').set({
            'preventFetch': true
          });
        };
      })(this));
    };

    AddMarkerMenuView.prototype.switchEditAction = function() {
      var actionArr;
      actionArr = this.$el.attr('action').split('/');
      if (actionArr[actionArr.length - 1] === 'markers') {
        actionArr.push('edit');
        this.$el.attr('action', actionArr.join('/'));
      } else {
        actionArr.pop();
        this.$el.attr('action', actionArr.join('/'));
      }
    };

    AddMarkerMenuView.prototype.hideForm = function() {
      var addBtn, addMarkerAlert, lat, lng, map, select;
      select = this.$('select[name=\'type[]\']');
      lat = this.$('input[name=\'lat\']');
      lng = this.$('input[name=\'lng\']');
      addMarkerAlert = $('.add-marker-alert');
      addBtn = $('.add-btn');
      map = this.model.get('parent').get('mapModel').get('map');
      if (addBtn.hasClass('active')) {
        addBtn.removeClass('active');
      }
      if (addMarkerAlert) {
        addMarkerAlert.remove();
      }
      if (this.tmp_model) {
        this.tmp_model.removeFromCollection();
        this.tmp_model = null;
      }
      google.maps.event.clearListeners(map, 'click');
      if (this.model.get('parent').get('activeEditMarker')) {
        this.model.set('action', null);
        this.model.get('parent').get('activeEditMarker').set('enableDrag', false);
        this.model.get('parent').get('activeEditMarker').set('lat', this.model.get('parent').get('cacheEditMarkerLat'));
        this.model.get('parent').get('activeEditMarker').set('lng', this.model.get('parent').get('cacheEditMarkerLng'));
        this.model.get('parent').get('activeEditMarker').set('type', this.model.get('parent').get('cacheEditMarkerType'));
        this.model.get('parent').get('activeEditMarker').trigger('redrawChangedLatLng', this.model.get('parent').get('activeEditMarker'));
        this.model.get('parent').set('cacheEditMarkerLat', null);
        this.model.get('parent').set('cacheEditMarkerLng', null);
        this.model.get('parent').set('cacheEditMarkerType', null);
        this.model.get('parent').set('activeEditMarker', null);
        this.switchEditAction();
      }
      this.model.get('parent').get('mapView').addClickListener(google.maps.event, map);
      this.$el.hide("slow", (function(_this) {
        return function() {
          _this.model.get('parent').set('preventFetch', false);
          select.val('');
          lng.val('');
          lng.val('');
        };
      })(this));
    };

    AddMarkerMenuView.prototype.validateForm = function(e) {
      var lat, lng, select;
      select = this.$('select[name=\'type[]\']');
      lat = this.$('input[name=\'lat\']');
      lng = this.$('input[name=\'lng\']');
      if (!(select.val() !== '' && lat.val() !== '' && lng.val() !== '')) {
        e.stopPropagation();
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        _.each(e.delegateTarget, function(el) {
          if ($(el).val() === '' && $(el).attr('type') !== 'hidden' && $(el).attr('type') !== 'submit') {
            $(el).parent().addClass('has-error');
          } else {

          }
        });
      } else {

      }
    };

    AddMarkerMenuView.prototype.watchLatLngChange = function() {
      var activeEditMarker, lat, lng;
      lat = this.$('input[name=\'lat\']');
      lng = this.$('input[name=\'lng\']');
      activeEditMarker = this.model.get('parent').get('activeEditMarker');
      if (activeEditMarker !== null) {
        activeEditMarker.on("change:lat", function() {
          return lat.val(activeEditMarker.get('lat'));
        });
        activeEditMarker.on("change:lng", function() {
          return lng.val(activeEditMarker.get('lng'));
        });
      }
    };

    return AddMarkerMenuView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.AddTypeMenuModel = (function(superClass) {
    extend(AddTypeMenuModel, superClass);

    function AddTypeMenuModel() {
      return AddTypeMenuModel.__super__.constructor.apply(this, arguments);
    }

    AddTypeMenuModel.prototype.defaults = {
      parent: null
    };

    AddTypeMenuModel.prototype.initialize = function(options) {};

    return AddTypeMenuModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.AddTypeMenuView = (function(superClass) {
    extend(AddTypeMenuView, superClass);

    function AddTypeMenuView() {
      return AddTypeMenuView.__super__.constructor.apply(this, arguments);
    }

    AddTypeMenuView.prototype.events = {
      "click .close": "hideForm"
    };

    AddTypeMenuView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
    };

    AddTypeMenuView.prototype.show = function() {
      return this.$el.show("slow", (function(_this) {
        return function() {
          _this.model.get('parent').set({
            'preventFetch': true
          });
        };
      })(this));
    };

    AddTypeMenuView.prototype.clearFields = function() {
      var image, type;
      type = this.$('input[name=\'type\']');
      image = this.$('input[name=\'image\']');
      console.log(type);
      type.val('');
      image.val('');
    };

    AddTypeMenuView.prototype.hideForm = function() {
      return this.$el.hide("slow", (function(_this) {
        return function() {
          _this.clearFields();
          return _this.model.get('parent').set({
            'preventFetch': false
          });
        };
      })(this));
    };

    return AddTypeMenuView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.ContextMenuModel = (function(superClass) {
    extend(ContextMenuModel, superClass);

    function ContextMenuModel() {
      return ContextMenuModel.__super__.constructor.apply(this, arguments);
    }

    ContextMenuModel.prototype.defaults = {
      parent: null,
      marker: null
    };

    ContextMenuModel.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
    };

    return ContextMenuModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.ContextMenuView = (function(superClass) {
    extend(ContextMenuView, superClass);

    function ContextMenuView() {
      return ContextMenuView.__super__.constructor.apply(this, arguments);
    }

    ContextMenuView.prototype.tagName = 'div';

    ContextMenuView.prototype.attributes = function() {
      var attributes;
      return attributes = {
        "class": 'context',
        id: 'js-context'
      };
    };

    ContextMenuView.prototype.events = {
      "click .edit": "editMarkerAction",
      "click .delete": "deleteMarkerAction"
    };

    ContextMenuView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.parent = this.model.get('parent');
    };

    ContextMenuView.prototype.unrender = function() {
      this.$el.remove();
      return this;
    };

    ContextMenuView.prototype.render = function() {
      var json;
      json = this.model.toJSON();
      this.template = _.template(App.Templates.contextMenuTpl);
      this.el.innerHTML = this.template(json);
      return this;
    };

    ContextMenuView.prototype.getContextPositionFromMarker = function() {
      var arrowDirection, canvas, canvasRight, canvasTop, contextHeight, contextWidth, fallout, markerLeft, markerTop, objectLeft, objectTop, offset, percent_position, secondary_calculation;
      canvas = $('#js-map');
      markerTop = this.model.get('marker').get('markerTop');
      markerLeft = this.model.get('marker').get('markerLeft');
      contextHeight = parseInt(this.$el.css('height'));
      contextWidth = parseInt(this.$el.css('width'));
      secondary_calculation = false;
      objectTop = markerTop - contextHeight / 2;
      objectLeft = canvas[0].clientWidth / 2 >= markerLeft ? markerLeft : markerLeft - contextWidth;
      offset = {
        x: 0,
        y: 0
      };
      canvasTop = canvas[0].offsetHeight;
      canvasRight = parseInt(canvas.css('width'));
      percent_position = markerTop * 100 / canvasTop;
      fallout = 'none';
      switch (true) {
        case percent_position >= 90:
          offset.x = 0;
          offset.y = -16;
          objectTop = markerTop - contextHeight;
          objectLeft = markerLeft - contextWidth / 2;
          secondary_calculation = true;
          arrowDirection = 'bottom';
          break;
        case percent_position <= 15:
          offset.x = 0;
          offset.y = this.model.get('marker').get('view').el.clientHeight - 6;
          objectTop = markerTop;
          objectLeft = markerLeft - contextWidth / 2;
          secondary_calculation = true;
          arrowDirection = 'top';
          break;
        default:
          if (canvas[0].clientWidth / 2 >= markerLeft) {
            offset.x = this.model.get('marker').get('view').el.clientWidth / 2 + 12;
          } else {
            offset.x = -this.model.get('marker').get('view').el.clientWidth / 2 - 10;
          }
          if ((canvas[0].clientWidth / 2) >= markerLeft) {
            arrowDirection = 'left';
          } else {
            arrowDirection = 'right';
          }
          objectTop = markerTop - 16;
          if (objectTop <= 34) {
            objectTop = canvasTop * 5 / 100 + 34;
          } else if ((objectTop + contextHeight) > canvasTop) {
            objectTop = canvasTop - contextHeight;
          } else {

          }
      }
      if (secondary_calculation) {
        if ((objectLeft + contextWidth) > canvasRight) {
          objectLeft = canvasRight - contextWidth;
          fallout = 'right';
        } else if (objectLeft < 1) {
          objectLeft = 0;
          fallout = 'left';
        }
      } else {

      }
      return {
        offset: offset,
        canvas: canvas,
        fallout: fallout,
        top: Math.round(objectTop),
        left: Math.round(objectLeft),
        height: contextHeight,
        width: contextWidth,
        arrow_direction: arrowDirection
      };
    };

    ContextMenuView.prototype.setContextPosition = function(config) {
      var context;
      context = $('#js-context');
      context.css({
        'left': config.left + config.offset.x,
        'top': config.top + config.offset.y
      });
    };

    ContextMenuView.prototype.editMarkerAction = function() {
      var attrs;
      attrs = {
        lat: this.model.get('marker').get('lat'),
        lng: this.model.get('marker').get('lng')
      };
      this.parent.get('addMarkerMenuModel').set('action', this.parent.get('addMarkerMenuView').$el.attr('action'));
      this.unrender();
      this.parent.get('addMarkerMenuView').show_form();
      this.parent.get('addMarkerMenuView').setLatLng(attrs);
      this.parent.get('addMarkerMenuView').setFields(this.model.get('marker'));
      this.parent.get('addMarkerMenuView').setType(this.model.get('marker'));
      this.parent.set('activeEditMarker', this.model.get('marker'));
      this.model.get('marker').set('enableDrag', true);
      this.parent.get('addMarkerMenuView').switchEditAction();
      if (!(this.parent.get('addMarkerMenuView').$('input[name=\'id\']').length > 0)) {
        this.parent.get('addMarkerMenuView').$el.prepend("<input name='id' type='hidden' value=" + (this.model.get('marker').get('id')) + ">");
      } else {
        this.parent.get('addMarkerMenuView').$('input[name=\'id\']').val(this.model.get('marker').get('id'));
      }
    };

    ContextMenuView.prototype.deleteMarkerAction = function() {
      console.log('deleteMarkerAction');
    };

    return ContextMenuView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.PopupModel = (function(superClass) {
    extend(PopupModel, superClass);

    function PopupModel() {
      return PopupModel.__super__.constructor.apply(this, arguments);
    }

    PopupModel.prototype.defaults = {
      parent: null,
      marker: null,
      mobile: null,
      title: null,
      description: null,
      type: null
    };

    PopupModel.prototype.initialize = function(options) {
      var md;
      md = new MobileDetect(window.navigator.userAgent);
      this.options = options != null ? options : null;
      this.set({
        'title': this.get('marker').get('title'),
        'description': this.get('marker').get('description'),
        'type': this.get('marker').get('type'),
        'mobile': md.mobile()
      });
    };

    return PopupModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.PopupView = (function(superClass) {
    extend(PopupView, superClass);

    function PopupView() {
      return PopupView.__super__.constructor.apply(this, arguments);
    }

    PopupView.prototype.tagName = 'div';

    PopupView.prototype.attributes = function() {
      var attributes;
      return attributes = {
        "class": (this.model.get('mobile') ? 'mobile ' : '') + 'popup ' + this.model.get('marker').get('type'),
        id: 'js-popup'
      };
    };

    PopupView.prototype.events = {
      "click .close": "unrender"
    };

    PopupView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.options.mapModel = this.model.get('parent').get('mapModel');
      this.options.map = this.options.mapModel.get('map');
    };

    PopupView.prototype.render = function() {
      var json;
      json = this.model.toJSON();
      this.template = _.template(App.Templates.popupTpl);
      this.el.innerHTML = this.template(json);
      return this;
    };

    PopupView.prototype.unrender = function() {
      this.$el.remove();
      return this;
    };

    PopupView.prototype.getWindowPositionFromMarker = function() {
      var arrowDirection, canvas, canvasRight, canvasTop, contextHeight, contextWidth, fallout, markerLeft, markerTop, objectLeft, objectTop, offset, percent_position, secondary_calculation;
      canvas = $('#js-map');
      markerTop = this.model.get('marker').get('markerTop');
      markerLeft = this.model.get('marker').get('markerLeft');
      contextHeight = parseInt(this.$el.css('height'));
      contextWidth = parseInt(this.$el.css('width'));
      secondary_calculation = false;
      objectTop = markerTop - contextHeight / 2;
      objectLeft = canvas[0].clientWidth / 2 >= markerLeft ? markerLeft : markerLeft - contextWidth;
      offset = {
        x: 0,
        y: 0
      };
      canvasTop = canvas[0].offsetHeight;
      canvasRight = parseInt(canvas.css('width'));
      percent_position = markerTop * 100 / canvasTop;
      fallout = 'none';
      switch (true) {
        case percent_position >= 90:
          offset.x = 0;
          offset.y = -30;
          objectTop = markerTop - contextHeight;
          objectLeft = markerLeft - contextWidth / 2;
          secondary_calculation = true;
          arrowDirection = 'bottom';
          break;
        case percent_position <= 15:
          offset.x = 0;
          offset.y = this.model.get('marker').get('view').el.clientHeight - 4;
          objectTop = markerTop;
          objectLeft = markerLeft - contextWidth / 2;
          secondary_calculation = true;
          arrowDirection = 'top';
          break;
        default:
          if (canvas[0].clientWidth / 2 >= markerLeft) {
            offset.x = this.model.get('marker').get('view').el.clientWidth / 2 + 12;
          } else {
            offset.x = -this.model.get('marker').get('view').el.clientWidth / 2 - 10;
          }
          if ((canvas[0].clientWidth / 2) >= markerLeft) {
            arrowDirection = 'left';
          } else {
            arrowDirection = 'right';
          }
          if (objectTop <= 34) {
            objectTop = canvasTop * 5 / 100 + 34;
          } else if ((objectTop + contextHeight) > canvasTop) {
            objectTop = canvasTop - contextHeight;
          } else {

          }
      }
      if (secondary_calculation) {
        if ((objectLeft + contextWidth) > canvasRight) {
          objectLeft = canvasRight - contextWidth;
          fallout = 'right';
        } else if (objectLeft < 1) {
          objectLeft = 0;
          fallout = 'left';
        }
      } else {

      }
      return {
        offset: offset,
        canvas: canvas,
        fallout: fallout,
        top: Math.round(objectTop),
        left: Math.round(objectLeft),
        height: contextHeight,
        width: contextWidth,
        arrow_direction: arrowDirection
      };
    };

    PopupView.prototype.setWindowPosition = function(config) {
      var popup;
      popup = $('#js-popup');
      if (!this.model.get('mobile')) {
        popup.css({
          'left': config.left + config.offset.x,
          'top': config.top + config.offset.y
        });
      }
    };

    PopupView.prototype.getArrowPosition = function(config) {
      var arrowPosition, marker, markerX, markerY, popup, rule;
      popup = $('#js-popup');
      marker = this.model.get('marker');
      markerY = marker.get('markerTop');
      markerX = marker.get('markerLeft');
      rule = $('<style id="js-arrow-correction-rule" type=\'text/css\'></style>');
      if (config.arrow_direction === 'left' || config.arrow_direction === 'right') {
        arrowPosition = 100 - ((config.height - Math.round(markerY - config.top)) * 100) / config.height;
        arrowPosition = 'top: ' + parseInt(arrowPosition);
      } else if (config.arrow_direction === 'top' || config.arrow_direction === 'bottom') {
        arrowPosition = (function() {
          switch (false) {
            case config.fallout !== 'left':
              return 'left: ' + parseInt((markerX * 100) / config.width);
            case config.fallout !== 'right':
              return 'left: ' + parseInt(((config.width - (config.canvas[0].clientWidth - markerX)) * 100) / config.width);
            default:
              return 'left: 50';
          }
        })();
      } else {

      }
      return rule.html("#js-popup:after, #js-popup:before{" + arrowPosition + "%;}");
    };

    return PopupView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.MapModel = (function(superClass) {
    extend(MapModel, superClass);

    function MapModel() {
      return MapModel.__super__.constructor.apply(this, arguments);
    }

    MapModel.prototype.defaults = {
      map: null,
      parent: null,
      dynamicLatLng: null,
      default_lat: 49.98081,
      default_lng: 36.25272,
      test_lat: 49.695173508416076,
      test_lng: 35.767364501953125
    };

    MapModel.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      return this.on("ready_to_init_map", function() {
        this.trigger('set_map_offset');
        this.trigger('init_map');
      });
    };

    return MapModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.MapView = (function(superClass) {
    extend(MapView, superClass);

    function MapView() {
      return MapView.__super__.constructor.apply(this, arguments);
    }

    MapView.prototype.tagName = 'div';

    MapView.prototype.className = 'map-container';

    MapView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.template = _.template(App.Templates.mapTpl);
      this.parent = this.model.get('parent');
      this.listenTo(this.model, "set_map_offset", this.setMapOffset);
      this.listenTo(this.model, "init_map", this.init_map);
      this.listenTo(this.model, "draw_map_menu", this.draw_map_menu);
    };

    MapView.prototype.render = function() {
      var json;
      json = this.model.toJSON();
      this.el.innerHTML = this.template(json);
      return this;
    };

    MapView.prototype.setMapOffset = function() {
      var navbar_height, ref;
      navbar_height = parseFloat((ref = $('.navbar').css('height')) != null ? ref : 0);
      this.$el.css({
        'padding-top': navbar_height,
        'margin-top': "-" + navbar_height
      });
    };

    MapView.prototype.addClickListener = function(e, map) {
      e.addListener(map, 'click', (function(_this) {
        return function() {
          if (_this.parent.get('mapMenuView')) {
            _this.parent.get('mapMenuView').hideMenu();
          }
          _this.parent.removePopupIfExists();
          _this.parent.removeContextIfExists();
        };
      })(this));
    };

    MapView.prototype.addIdleListeners = function(e, map) {
      e.addListener(map, 'idle', (function(_this) {
        return function() {
          var LatLng, center;
          center = map.getCenter();
          LatLng = {
            'lat': center.lat(),
            'lng': center.lng()
          };
          _this.model.set({
            'dynamicLatLng': LatLng
          });
          _this.parent.updateArea();
          if (_this.parent.get('mapMenuView')) {
            _this.parent.get('mapMenuView').hideMenu();
          }
          _this.parent.removePopupIfExists();
          _this.parent.removeContextIfExists();
        };
      })(this));
      e.addListenerOnce(map, 'idle', (function(_this) {
        return function() {
          return _this.parent.trigger('map_ready');
        };
      })(this));
    };

    MapView.prototype.addDragstartListeners = function(e, map) {
      e.addListener(map, 'dragstart', (function(_this) {
        return function() {
          if (_this.parent.get('mapMenuView')) {
            _this.parent.get('mapMenuView').hideMenu();
          }
          _this.parent.removePopupIfExists();
          _this.parent.removeContextIfExists();
        };
      })(this));
    };

    MapView.prototype.addZoomChangedListeners = function(e, map) {
      e.addListener(map, 'zoom_changed', (function(_this) {
        return function() {};
      })(this));
    };

    MapView.prototype.init_map = function() {
      var e, map;
      e = google.maps.event;
      this.model.set({
        'map': new google.maps.Map(this.$('#js-map')[0], {
          disableDefaultUI: true,
          center: {
            lat: this.model.get('default_lat'),
            lng: this.model.get('default_lng')
          },
          disableDoubleClickZoom: true,
          zoom: 12
        })
      });
      map = this.model.get('map');
      this.addClickListener(e, map);
      this.addIdleListeners(e, map);
      this.addDragstartListeners(e, map);
      return this.addZoomChangedListeners(e, map);
    };

    return MapView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Models.WikiLocalsModel = (function(superClass) {
    extend(WikiLocalsModel, superClass);

    function WikiLocalsModel() {
      return WikiLocalsModel.__super__.constructor.apply(this, arguments);
    }

    WikiLocalsModel.prototype.defaults = {
      area: null,
      activeCategory: null,
      activeEditMarker: null,
      addMarkerMenuModel: null,
      addMarkerMenuView: null,
      addTypeMenuModel: null,
      addTypeMenuView: null,
      categories: null,
      cacheEditMarkerLat: null,
      cacheEditMarkerLng: null,
      cluster: null,
      getCategories: null,
      googleMapMarkers: [],
      location: null,
      mapMenuModel: null,
      mapMenuView: null,
      mapModel: null,
      mapView: null,
      markerCollection: null,
      markerCollectionView: null,
      popupModel: null,
      popupView: null,
      preventFetch: false,
      performQuerie: null,
      contextModel: null,
      contextView: null
    };

    WikiLocalsModel.prototype.initialize = function(options) {
      var location, trigger;
      this.options = options != null ? options : null;
      trigger = (function(_this) {
        return function() {
          _this.trigger('draw_map_menu');
        };
      })(this);
      location = window.location.pathname.split('/');
      this.initMap();
      this.on("change:area", function() {
        if (!this.get('preventFetch')) {
          return this.updateMarkersCollection();
        }
      });
      this.on("change:activeEditMarker", function() {
        this.get('addMarkerMenuModel').trigger('start_watch_lat_lng_change');
        if (this.get('activeEditMarker') !== null) {
          this.set('cacheEditMarkerLat', this.get('activeEditMarker').get('lat'));
          this.set('cacheEditMarkerLng', this.get('activeEditMarker').get('lng'));
          return this.set('cacheEditMarkerType', this.get('activeEditMarker').get('type'));
        }
      });
      this.on("collection_render", function() {
        this.updateGMapMarkersArray();
        return this.initMarkersClusterer();
      });
      this.on("map_ready", function() {
        this.set({
          'area': this.getArea()
        });
        return this.initMarkersCollection();
      });
      this.on("map_ready", function() {
        this.initMapMenu();
        return this.getCategories((function(_this) {
          return function(data) {
            _this.set({
              'categories': data
            });
            _this.set({
              'addMarkerMenuModel': new App.Models.AddMarkerMenuModel({
                parent: _this
              })
            });
            _this.set({
              'addMarkerMenuView': new App.Views.AddMarkerMenuView({
                el: '.add-marker',
                model: _this.get('addMarkerMenuModel'),
                map_model: _this.get('mapModel')
              })
            });
            _this.set({
              'addTypeMenuModel': new App.Models.AddTypeMenuModel({
                parent: _this
              })
            });
            _this.set({
              'addTypeMenuView': new App.Views.AddTypeMenuView({
                el: '.add-new-type',
                model: _this.get('addTypeMenuModel'),
                map_model: _this.get('mapModel')
              })
            });
            _.defer(trigger);
          };
        })(this));
      });
      location.pop();
      this.set({
        'location': location.join('/')
      });
    };

    WikiLocalsModel.prototype.getArea = function() {
      var bounds, center, map, northX, northY, offset, params, southX, southY;
      map = this.get('mapModel').get('map');
      bounds = map.getBounds();
      center = map.getCenter();
      northX = bounds.getNorthEast().lng();
      northY = bounds.getNorthEast().lat();
      southX = bounds.getSouthWest().lng();
      southY = bounds.getSouthWest().lat();
      offset = [northX - southX, northY - southY];
      params = {
        'lngMin': parseFloat(center.K) - offset[0] / 2,
        'lngMax': parseFloat(center.K) + offset[0] / 2,
        'latMin': parseFloat(center.G) - offset[1] / 2,
        'latMax': parseFloat(center.G) + offset[1] / 2
      };
      return "lng_min=" + (encodeURIComponent(params.lngMin)) + "&lat_min=" + (encodeURIComponent(params.latMin)) + " &lng_max=" + (encodeURIComponent(params.lngMax)) + "&lat_max=" + (encodeURIComponent(params.latMax));
    };

    WikiLocalsModel.prototype.getActiveCategory = function() {
      var category;
      if (this.get('activeCategory')) {
        category = this.get('activeCategory').split('=');
        category.shift();
        if (category[0].split(',').length === 1) {
          return category;
        } else {
          return category[0].split(',');
        }
      } else {
        return false;
      }
    };

    WikiLocalsModel.prototype.updateArea = function() {
      var area, trigger;
      area = this.getArea();
      trigger = (function(_this) {
        return function() {
          _this.trigger('menu_ready');
        };
      })(this);
      this.set({
        'area': area
      });
      if (!_.isNull(this.get('markerCollection'))) {
        this.getCategories((function(_this) {
          return function(data) {
            _this.set({
              'categories': data
            });
            _.defer(trigger);
          };
        })(this));
      }
    };

    WikiLocalsModel.prototype.getPopup = function() {
      return {
        model: this.get('popupModel'),
        view: this.get('popupView')
      };
    };

    WikiLocalsModel.prototype.getContext = function() {
      return {
        model: this.get('contextModel'),
        view: this.get('contextView')
      };
    };

    WikiLocalsModel.prototype.removePopupIfExists = function() {
      var popup;
      popup = this.getPopup();
      if (!_.isNull(popup.view)) {
        if (!popup.model.get('mobile')) {
          this.get('popupView').unrender();
        }
      }
    };

    WikiLocalsModel.prototype.removeContextIfExists = function() {
      var context;
      context = this.getContext();
      if (!_.isNull(context.view)) {
        this.get('contextView').unrender();
      }
    };

    WikiLocalsModel.prototype.initMapMenu = function() {
      var collection;
      collection = this.get('markerCollection');
      this.set({
        'mapMenuModel': new App.Models.MapMenuModel({
          parent: this,
          collection: collection
        })
      });
      this.set({
        'mapMenuView': new App.Views.MapMenuView({
          model: this.get('mapMenuModel')
        })
      });
    };

    WikiLocalsModel.prototype.getCategories = function(callback) {
      var location;
      location = (this.get('location')) + "/markers/categories/";
      this.set('getCategories', $.ajax({
        type: 'GET',
        url: location + this.get('area'),
        dataType: 'json'
      }));
      this.get('getCategories').done(function(data) {
        return callback(data);
      }).fail(function(jqXHR, textStatus) {
        return console.warn(textStatus);
      });
    };

    WikiLocalsModel.prototype.initMap = function() {
      var trigger;
      trigger = (function(_this) {
        return function() {
          return _this.trigger('map_ready_to_render');
        };
      })(this);
      this.set({
        'mapModel': new App.Models.MapModel({
          parent: this
        })
      });
      this.set({
        'mapView': new App.Views.MapView({
          model: this.get('mapModel')
        })
      });
      _.defer(trigger);
    };

    WikiLocalsModel.prototype.initMarkersCollection = function() {
      var location, trigger;
      location = this.get('location');
      trigger = (function(_this) {
        return function() {
          return _this.trigger('collection_ready');
        };
      })(this);
      this.set({
        'markerCollection': new App.Collections.MarkerCollection()
      });
      this.get('markerCollection').url = location + '/markers/' + this.get('area');
      this.get('markerCollection').parent = this;
      this.get('markerCollection').fetch({
        reset: true,
        success: (function(_this) {
          return function(collection, response, options) {
            _this.set({
              'markerCollectionView': new App.Views.MarkerCollectionView({
                collection: collection
              })
            });
            return _.defer(trigger);
          };
        })(this),
        error: function(collection, response, options) {
          return console.error(response);
        }
      });
    };

    WikiLocalsModel.prototype.updateMarkersCollection = function() {
      var location;
      location = (this.get('location')) + "/markers/";
      if (!_.isNull(this.get('activeCategory'))) {
        location += (this.get('activeCategory')) + "&";
      }
      if (!_.isNull(this.get('markerCollection'))) {
        this.get('markerCollection').url = location + this.get('area');
        if (_.isNull(this.get('performQuerie'))) {
          this.set('performQuerie', this.get('markerCollection').fetch({
            reset: false,
            success: (function(_this) {
              return function(collection, response, options) {
                return _this.set('performQuerie', null);
              };
            })(this),
            error: (function(_this) {
              return function(collection, response, options) {
                console.error(response);
                return _this.set('performQuerie', null);
              };
            })(this)
          }));
        } else {

        }
      }
    };

    WikiLocalsModel.prototype.updateGMapMarkersArray = function() {
      var collection, markersArray;
      collection = this.get('markerCollection');
      markersArray = this.get('googleMapMarkers');
      markersArray.length = 0;
      return collection.each((function(_this) {
        return function(el, key) {
          return markersArray.push(el.get('view').label);
        };
      })(this));
    };

    WikiLocalsModel.prototype.initMarkersClusterer = function() {
      var cluster;
      cluster = new MarkerClusterer(this.get('mapModel').get('map'), this.get('googleMapMarkers'));
      return this.set('cluster', cluster);
    };

    return WikiLocalsModel;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.Views.WikiLocalsView = (function(superClass) {
    extend(WikiLocalsView, superClass);

    function WikiLocalsView() {
      return WikiLocalsView.__super__.constructor.apply(this, arguments);
    }

    WikiLocalsView.prototype.events = {
      "click #js-add-btn": "addMarkerAction"
    };

    WikiLocalsView.prototype.initialize = function(options) {
      this.options = options != null ? options : null;
      this.listenTo(this.model, "map_ready_to_render", this.drawMap);
      this.listenTo(this.model, "draw_map_menu", this.drawMapMenu);
      this.listenTo(this.model, "menu_ready", this.drawMenuItems);
      this.listenTo(this.model, "collection_ready", this.drawCollection);
      return this;
    };

    WikiLocalsView.prototype.render = function() {
      return this;
    };

    WikiLocalsView.prototype.drawMap = function() {
      var map_model, map_view;
      map_model = this.model.get('mapModel');
      map_view = this.model.get('mapView');
      this.$el.append(map_view.render().el);
      map_model.trigger('set_map_offset');
      map_model.trigger('init_map');
      return this;
    };

    WikiLocalsView.prototype.drawMapMenu = function() {
      var map_menu_node;
      map_menu_node = this.model.get('mapMenuView').render().el;
      this.model.get('mapView').$el.append(map_menu_node);
      this.model.trigger('menu_ready');
      return this;
    };

    WikiLocalsView.prototype.drawMenuItems = function() {
      var map_menu_view;
      map_menu_view = this.model.get('mapMenuView');
      map_menu_view.unrenderMenuItems();
      map_menu_view.renderMenuItems();
      return this;
    };

    WikiLocalsView.prototype.drawCollection = function() {
      var collection_view;
      collection_view = this.model.get('markerCollectionView');
      collection_view.renderCollection();
      return this;
    };

    return WikiLocalsView;

  })(Backbone.View);

}).call(this);

(function() {
  var WikiLocalsModel;

  WikiLocalsModel = new App.Models.WikiLocalsModel();

  new App.Views.WikiLocalsView({
    el: $('.content'),
    model: WikiLocalsModel
  });

}).call(this);

//# sourceMappingURL=app.js.map
