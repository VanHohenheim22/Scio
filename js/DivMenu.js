let GROUP_CSS_CLASS="div-menu",
    ALL_ITEM_CSS_CLASS="todos",
    ITEM_CSS_CLASS="menu-item";

class DivMenu extends dc.BaseMixin {
  constructor(parent, chartGroup) {
    super();
    this._divMenu = undefined;
    this._promptText = undefined;
    this._uniqueId = dc.utils.uniqueId();
    this._filterDisplayed = d => this.valueAccessor()(d) > 0;
    this._order = (a, b) => {
      if (this.keyAccessor()(a) > this.keyAccessor()(b)) {
        return 1;
      }
      if (this.keyAccessor()(a) < this.keyAccessor()(b)) {
        return -1;
      }
      return 0;
    };
    this._topN = 10; // Number of elements to display
    this.data(group => group.top(this._topN).filter(this._filterDisplayed));
    this.anchor(parent, chartGroup);
  }

  _html(that) {
    return function (d) {
      let res = `<p><span class='label'>${that.keyAccessor()(d)}</span></p> `;
      return res;
    };
  }

  _drawChart() {
    var chart = this;

    this.selectAll('div').remove();
    this._divMenu = this.root().classed(GROUP_CSS_CLASS, true);

    if (this._promptText) {
      this.root()
        .append('div')
        .attr('class', `${ALL_ITEM_CSS_CLASS}`)
        .classed('all-button', true)
        .html(chart._promptText)
        .on('click', function (e, d) {
          this.onclick(d);
        });
    }

    this.selectAll(`.${ITEM_CSS_CLASS}`)
      .data(this.data(), d => this.keyAccessor()(d))
      .join('div')
      .attr('class', ITEM_CSS_CLASS)
      .html(this._html(this))
      .classed('selected', d => this.hasFilter(this.keyAccessor()(d)))  // Check if the item is selected
      .on('click', function (e, d) {
        chart.onClick(d);
      });
   }

  _doRender() {
    this._drawChart();
    return this;
  }

  _doRedraw() {
    this._drawChart();
    return this;
  }

  _onClick(that) {
    return function (d) {
      var value = that.keyAccessor()(d);
      that.selectAll('div').classed('selected', false);

      d3.select(this).classed('selected', true);

      dc.events.trigger(() => {
        that.dimension().filter(value);
        that.renderGroup();
      });
    };
  }
/**
     * Get or set the function that controls the ordering of option tags in the
     * divMenu. By default options are ordered by the group key in ascending
     * order.
     * @param {Function} [order]
     * @returns {Function|DivMenu}
     * @example
     * // order by the group's value
     * chart.order(function (a,b) {
     *     return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
     * });
     */
    order (order) {
        if (!arguments.length) {
            return this._order;
        }
        this._order = order;
        return this;
    }
    /**
     * Get or set the text displayed in the options used to prompt selection.
     * @param {String} [promptText='Select all']
     * @returns {String|DivMenu}
     * @example
     * chart.promptText('All states');
     */
    promptText (promptText) {
        if (!arguments.length) {
            return this._promptText;
        }
        this._promptText = promptText;
        return this;
    }

    /**
     * Get or set the function that filters options prior to display. By default options
     * with a value of < 1 are not displayed.
     * @param {function} [filterDisplayed]
     * @returns {Function|DivMenu}
     * @example
     * // display all options override the `filterDisplayed` function:
     * chart.filterDisplayed(function () {
     *     return true;
     * });
     */
    filterDisplayed (filterDisplayed) {
        if (!arguments.length) {
            return this._filterDisplayed;
        }
        this._filterDisplayed = filterDisplayed;
        return this;
    }

    htmlFactory (f) {
        if (!arguments.length) return this._html;
        this._html = f;
        return this;
    }
}

