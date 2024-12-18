﻿import { Theme } from "@table-library/react-table-library/theme";

const tableTheme: Theme = {
  Table: `
    background-color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  `,
  HeaderRow: `
    background-color: #BC99EB;
    color: #FFFFFF;
    border-bottom: 2px solid #7E8FA9;
    font-weight: bold;
    text-transform: uppercase;
  `,
  Row: `
    border-bottom: 1px solid #DFDFDF;
    &:hover {
      background-color: #F5F5F5;
    }
  `,
  Cell: `
    padding: 12px 16px;
    font-size: 0.9rem;
    color: #7E8FA9;
  `,
  FooterRow: `
    background-color: #BC99EB;
    color: #FFFFFF;
  `,
};

export default tableTheme;