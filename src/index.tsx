import * as React from "react";

type Props<E> = {
  size: number;
  fetch: (offset: number, limit: number) => Promise<FetchResult<E>>;
  children: (page: Page<E>) => JSX.Element;
};

type State<E> = {
  pageIndex: number;
  loading: boolean;
  error: string | null;
  entries: E[];
  total: number;
};

type FetchResult<E> = {
  entries: E[];
  total: number;
};

enum PageStatus {
  LOADING = "loading",
  ERROR = "error",
  DATA = "data",
}

type Page<E> = {
  status: PageStatus;
  error: any;

  entries: E[];
  total: number;

  pageIndex: number;
  pageCount: number;

  navigateTo: (pageIndex: number) => void;
};

class FetchPage<E> extends React.Component<Props<E>, State<E>> {
  state = {
    pageIndex: 0,
    loading: true,
    error: null,
    entries: [],
    total: 0,
  };

  componentDidMount() {
    this.fetchAndRender(0);
  }

  fetchAndRender(newPageIndex: number) {
    this.setState(prevState => ({
      pageIndex: newPageIndex,
      loading: true,
      error: null,
      entries: prevState.entries,
      total: prevState.total, // keep this for the pager
    }));

    const offset = newPageIndex * this.props.size;
    const limit = this.props.size;

    this.props
      .fetch(offset, limit)
      .then(response => {
        this.setState({
          pageIndex: newPageIndex,
          loading: false,
          error: null,
          entries: response.entries,
          total: response.total,
        });
      })
      .catch(error => {
        this.setState(prevState => ({
          pageIndex: newPageIndex,
          loading: false,
          error: error || "Error loading data",
          entries: [],
          total: prevState.total,
        }));
      });
  }

  render() {
    const pageCount = Math.max(1, Math.ceil(this.state.total / this.props.size));

    const shared = {
      pageIndex: this.state.pageIndex,
      pageCount: pageCount,
      total: this.state.total,
      navigateTo: (newPageIndex: number) => {
        this.fetchAndRender(Math.max(0, Math.min(pageCount - 1, newPageIndex)));
      },
    };

    // LOADING
    if (this.state.loading) {
      return this.props.children({
        ...shared,
        status: PageStatus.LOADING,
        error: null,
        entries: [],
      });
    }

    // ERROR
    if (this.state.error) {
      return this.props.children({
        ...shared,
        status: PageStatus.ERROR,
        error: this.state.error,
        entries: [],
      });
    }

    // DATA
    else {
      return this.props.children({
        ...shared,
        status: PageStatus.DATA,
        error: null,
        entries: this.state.entries,
      });
    }
  }
}

export default FetchPage;
