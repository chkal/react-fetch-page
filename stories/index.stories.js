import React from "react";

import { storiesOf } from "@storybook/react";
import FetchPage from "../src/index";
import { Pager } from "./pager";

storiesOf("FetchPage", module).add("Simple demo", () => {
  const data = [];
  for (let i = 0; i < 123; i++) {
    data.push({
      name: "Entry " + (i + 1),
    });
  }

  const fetcher = (offset, limit) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          entries: data.slice(offset, offset + limit),
          total: data.length,
        });
      }, 700);
    });
  };

  return (
    <FetchPage size={5} fetch={fetcher}>
      {page => (
        <React.Fragment>
          <table border="1">
            <thead>
              <tr>
                <th>Col1</th>
                <th>Col2</th>
                <th>Col3</th>
              </tr>
            </thead>
            <tbody>
              {page.status === "loading" && (
                <tr>
                  <td colSpan={3}>Loading...</td>
                </tr>
              )}

              {page.status === "error" && (
                <tr>
                  <td colSpan={3}>{page.error}</td>
                </tr>
              )}

              {page.status === "data" &&
                page.entries.map(entry => (
                  <tr>
                    <td>{entry.name}</td>
                    <td>{entry.name}</td>
                    <td>{entry.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <Pager currentPage={page.pageIndex} totalPages={page.pageCount} onChange={i => page.navigateTo(i)} />
        </React.Fragment>
      )}
    </FetchPage>
  );
});
