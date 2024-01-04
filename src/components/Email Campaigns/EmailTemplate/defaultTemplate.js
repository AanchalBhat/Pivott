import { BasicType, AdvancedType } from "easy-email-core";

export const defaultCategories = [
  {
    label: "Content",
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: "0px 0px 0px 0px" } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.NAVBAR,
      },
      {
        type: AdvancedType.SECTION,
      },
      {
        type: AdvancedType.WRAPPER,
      },
      {
        type: AdvancedType.ACCORDION,
      },
      {
        type: BasicType.HERO,

        payload: {
          data: {
            value: {},
          },
          attributes: {
            "background-color": "#ffffff",
            "background-position": "center center",
            mode: "fluid-height",
            padding: "223px 0px 223px 0px",
            "vertical-align": "top",
            "background-url":
              "http://api.staging.pivott.ai/email_campaign_template_images/76",
          },
          children: [],
        },
      },
      {
        type: AdvancedType.COLUMN,
      },
      {
        type: AdvancedType.GROUP,
      },
      {
        type: BasicType.TABLE,
        payload: {
          data: {
            value: {
              content: `<!DOCTYPE html>
                <html>
                <head>
                <style>
                table {
                  font-family: arial, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                }
                
                td, th {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
                  font-size:12px
                }
                
                tr:nth-child(even) {
                  background-color: #dddddd;
                }
                </style>
                </head>
                <body>
                
                <h2>HTML Table</h2>
                
                <table>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Country</th>
                  </tr>
                  <tr>
                    <td>Alfreds Futterkiste</td>
                    <td>Maria Anders</td>
                    <td>Germany</td>
                  </tr>
                  <tr>
                    <td>Centro comercial Moctezuma</td>
                    <td>Francisco Chang</td>
                    <td>Mexico</td>
                  </tr>
                  <tr>
                    <td>Ernst Handel</td>
                    <td>Roland Mendel</td>
                    <td>Austria</td>
                  </tr>
                  <tr>
                    <td>Island Trading</td>
                    <td>Helen Bennett</td>
                    <td>UK</td>
                  </tr>
                  <tr>
                    <td>Laughing Bacchus Winecellars</td>
                    <td>Yoshi Tannamuri</td>
                    <td>Canada</td>
                  </tr>
                  <tr>
                    <td>Magazzini Alimentari Riuniti</td>
                    <td>Giovanni Rovelli</td>
                    <td>Italy</td>
                  </tr>
                </table>
                
                </body>
                </html>
                
                `,
            },
          },
        },
      },
      {
        type: BasicType.CAROUSEL,
      },
    ],
  },
  {
    label: "Layout",
    active: false,
    displayType: "column",
    blocks: [
      {
        title: "2 columns",
        payload: [
          ["50%", "50%"],
          ["33%", "67%"],
          ["67%", "33%"],
          ["25%", "75%"],
          ["75%", "25%"],
        ],
      },
      {
        title: "3 columns",
        payload: [
          ["33.33%", "33.33%", "33.33%"],
          ["25%", "25%", "50%"],
          ["50%", "25%", "25%"],
        ],
      },
      {
        title: "4 columns",
        payload: [["25%", "25%", "25%", "25%"]],
      },
    ],
  },
];
export const fontList = [
  "Arial",
  "Tahoma",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Lato",
  "Montserrat",
].map((item) => ({ value: item, label: item }));
