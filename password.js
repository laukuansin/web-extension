var defaultOptions = {
    upper_case: true,
    lower_case: true,
    numbers: true,
    lookalikes: false,
    symbols: false,
    oksymbols: '@#$%&-+*!?/.',
    length: 10,
  };

document.getElementById("version_name").innerHTML=browser.runtime.getManifest().version;


