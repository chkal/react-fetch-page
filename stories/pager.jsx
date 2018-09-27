import * as React from "react";

export class Pager extends React.Component {
  first() {
    this.navigate(0);
  }

  last() {
    this.navigate(this.props.totalPages - 1);
  }

  prev() {
    this.navigate(this.props.currentPage - 1);
  }

  next() {
    this.navigate(this.props.currentPage + 1);
  }

  navigate(index) {
    const newPage = Math.max(0, Math.min(index, this.props.totalPages - 1));
    if (this.props.currentPage !== newPage) {
      this.props.onChange(newPage);
    }
  }

  render() {
    const prevEnabled = this.props.currentPage > 0;
    const nextEnabled = this.props.currentPage < this.props.totalPages - 1;

    return (
      <div>
        {this.renderNavigationLink("««", "First Page", prevEnabled, () => this.first())}
        {this.renderNavigationLink("«", "Previous Page", prevEnabled, () => this.prev())}

        <div style={{ display: "inline-block" }}>
          {this.props.currentPage + 1} of {this.props.totalPages}
        </div>

        {this.renderNavigationLink("»", "Next Page", nextEnabled, () => this.next())}
        {this.renderNavigationLink("»»", "Last Page", nextEnabled, () => this.last())}
      </div>
    );
  }

  renderNavigationLink(symbol, title, enabled, clickHandler) {
    return (
      <div style={{ display: "inline-block", margin: "5px" }}>
        <a href="javascript:void(0)" onClick={() => clickHandler()} title={title}>
          {symbol}
        </a>
      </div>
    );
  }
}
