import React, { useEffect, useState } from "react";
const ExcelJS = require("exceljs");

const token = localStorage.getItem('lm_token')
const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}property/export`, requestOptions)
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        setData(data);
      })
  }, []);

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    sheet.properties.defaultRowHeight = 80;

    sheet.getRow(1).border = {
      top: { style: "thick", color: { argb: "FFFF0000" } },
      left: { style: "thick", color: { argb: "000000FF" } },
      bottom: { style: "thick", color: { argb: "F08080" } },
      right: { style: "thick", color: { argb: "FF00FF00" } },
    };

    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "darkVertical",
      fgColor: { argb: "FFFF00" },
    };

    sheet.getRow(1).font = {
      name: "Comic Sans MS",
      family: 4,
      size: 16,
      bold: true,
    };

    sheet.columns = [
      {
        header: "Id",
        key: "id",
        width: 10,
      },
      { header: "Title", key: "title", width: 32 },
      {
        header: "Brand",
        key: "brand",
        width: 20,
      },
      {
        header: "Category",
        key: "category",
        width: 20,
      },
      {
        header: "Price",
        key: "price",
        width: 15,
      },
      {
        header: "Rating",
        key: "rating",
        width: 10,
      },
      {
        header: "Photo",
        key: "thumbnail",
        width: 30,
      },
    ];

    const promise = Promise.all(
      data?.map(async (product, index) => {
        const rowNumber = index + 1;
        sheet.addRow({
          id: product?.id,
          title: product?.available_for,
          brand: product?.owner_name,
          category: product?.owner_mobile,
          price: product?.nature_of_premises,
          rating: product?.available_for,
        });
        console.log(product?.image);
        const type = product?.image.split(';')[0].split('/')[1];
        console.log(type)
        const imageId2 = workbook.addImage({
          base64: product?.image,
          extension: type,
        });

        sheet.addImage(imageId2, {
          tl: { col: 6, row: rowNumber },
          ext: { width: 100, height: 100 },
        });
      })
    );

    promise.then(() => {
      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "download.xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <button
        className="btn btn-primary float-end mt-2 mb-2"
        onClick={exportExcelFile}
      >
        Export
      </button>
      <h3>Table Data:</h3>
      <table className="table table-bordered">
        <thead style={{ background: "yellow" }}>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Title</th>
            <th scope="col">Brand</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Rating</th>
            <th scope="col">Photo</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data?.map((row) => (
              <tr>
                <td>{row?.id}</td>
                <td>{row?.title}</td>
                <td>{row?.brand}</td>
                <td>{row?.category}</td>
                <td>${row?.price}</td>
                <td>{row?.rating}/5</td>
                <td>
                  <img src={row?.image} width="100" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;