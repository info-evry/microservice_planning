import convict from "convict";
import path from "path";

let config = convict({});

const conf = require(path.join(__dirname, "/configuration.json"));
config.load(conf);

export { config };
