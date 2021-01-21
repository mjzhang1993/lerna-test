const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const { template } = require("lodash");

const args = process.argv.splice(2);
const fileDirRootPath = args[0];
const error = chalk.bold.red;
const success = chalk.bold.green;

const renderSvgIcon = template(`
import * as React from 'react';
import BaseIcon from "./components/BaseIcon";
import <%= svgName %>Svg from "./svg/<%= svgName %>";
import { IBaseIconTypes } from './Types'

interface IProps extends IBaseIconTypes {
  color?: string;
}

const <%= svgName %> = (props: IProps) => {
  
  render(): React.ReactNode {
    const { color, ...others } = this.props;
    return (
      <BaseIcon component={<%= svgName %>Svg} fill={color} {...others} />
    );
  }
}

export default <%= svgName %>;
`);

const renderSvg = template(`
import * as React from 'react';

const  <%= svgName %> = (props: any) => (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" {...props}>
    <%= content %>
  )

export default  <%= svgName %>
`);

const indexExport = template(`
export { default as <%= svgName %>Icon } from './<%= svgName %>';
`);

const iconPath = path.resolve(__dirname, "../src");
const svgPath = path.resolve(__dirname, "../src/svg");

const currentTSXFiles = fs.readdirSync(path.resolve(__dirname, "../src/svg"))

function readFileDir(fileDirPath) {
  fs.readdir(fileDirPath, { encoding: "utf-8" }, (err, files) => {
    if (err) {
      console.error(error('error'), err);
    }
    files.forEach((fullFilename) => {
      const filePath = path.join(fileDirPath, fullFilename);
      const stats = fs.statSync(filePath);
      const isDir = stats.isDirectory();
      const isFile = stats.isFile();
      if (isDir) {
        readFileDir(filePath);
      }
      if (isFile) {
        if (!/\.(svg)$/.test(fullFilename)) { 
          console.log(error(fullFilename+ " is't svg"));
          return;
        };
        const FileName = fullFilename.replace(".svg", "");
        fs.readFile(filePath,(readErr, data) => {
          if (readErr) {
            console.log(error(`${FileName}.svg read failed`, readErr));
          }
          const svgData = SVGToReact(data);
          fs.writeFile(
            path.join(svgPath, FileName + ".tsx"),
            renderSvg({ svgName: FileName , content: svgData}),
            (writeErr) => {
              if (err) {
                console.error(
                  error(`${FileName} svg component is failed`),
                  writeErr
                );
              } else {
                console.info(success(`${FileName} svg component is saved`));
              }
            }
          );
        })
        fs.writeFile(
          path.join(iconPath, FileName + ".tsx"),
          renderSvgIcon({ svgName: FileName }),
          (writeErr) => {
            if (err) {
              console.error(error(`${FileName}.tsx is failed`), writeErr);
            } else {
              console.info(success(`${FileName}.tsx is saved`));
            }
          }
        );
        appendIndexTSX(FileName);
      }
    });
  });
}

function SVGToReact(data) {
  const svgData = data.toString("utf-8").match(/<svg([\S\s]*)svg>/) || [];
  if (svgData.length == 0) {
    return null;
  }
  return svgData[0].replace(
    /<svg([\s\S]*?)>/,
    ''
  );
}

function appendIndexTSX(fileName) {
  if (currentTSXFiles.includes(`${fileName}.tsx`)) return;
  fs.appendFile(
    path.join(iconPath, "index.tsx"),
    indexExport({ svgName: fileName }),
    () => {}
  );
}
readFileDir(fileDirRootPath)

