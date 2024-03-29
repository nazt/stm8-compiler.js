#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {createCompiler} = require("./Compiler");
const pkg = require("./package");

var argv = require("yargs").
usage("Usage: $0 <cmd> [options]") // usage string of application.
.command("compile", "compile stm8 program.", yarg => {
  // console.log(`call command compile`)
}, argv => {
  if (!argv.context) {
    console.log(`please add option --context [file.json]`);
    return;
  }

  let context = path.resolve(argv.context);
  let Compiler;

  context = JSON.parse(fs.readFileSync(context).toString());
  context.process_dir = `/Users/nat/projects/nodejs/stm8-compiler.js`;
  context.toolchain_dir = `/usr/local/bin`;
  Compiler = createCompiler(context);

  console.log(`start compile.`);
  Compiler.compile(context).then(() => {
    console.log("compile all files done");
  }).catch(err => {
    console.error("project failed.");
  });
}).
help("help").
version("version", pkg.version, `version ${pkg.version}`).alias("version", "v").
alias("help", "h").
alias("context", "c").
showHelpOnFail(true, "whoops, something went wrong! run with --help").
command("flash", "flash device using esptool.", yargs => {
  // pass
}, argv => {
  let context = path.resolve(argv.context);
  context = JSON.parse(fs.readFileSync(context).toString());
  let {tools} = context.flasher;
  console.log(tools);

}).
command("generate", "generate a dummy context configuration.", yargs => {
  // pass
}, argv => {
  const dummy = fs.readFileSync(`${__dirname}/context.json`).toString();
  console.log(dummy);
}).
demandCommand(1).argv;

