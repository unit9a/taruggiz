var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "node", //"browser" or "node"
    resources: [
        "src/**/*.js"
    ],
    //
    tests: [
        //"tests/busterSetupCheck.js",
        "tests/spec/*.js"
    ]
}