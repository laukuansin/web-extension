var defaultOptions = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    noRepeat: false,
    specialChars: false,
    excludeChars: false,
    excludeInput: '',
    length: 10,
  };
var copy = document.getElementById('copy');
var visible= document.getElementById('visible');
var passwordInput = document.getElementById("passwordInput");
var uppercase=document.getElementById("uppercase");
var lowercase=document.getElementById("lowercase");
var numbers=document.getElementById("numbers");
var symbols=document.getElementById("symbols");
var noRepeat=document.getElementById("noRepeat");
var specialChars=document.getElementById("specialChars");
var excludeChars=document.getElementById("excludeChars");
var generate=document.getElementById("generate");
var remind=document.getElementById("reminder");
var excludeInput=document.getElementById("excludeInput");
var viewHis=document.getElementById("history");

document.getElementById("version_name").innerHTML=browser.runtime.getManifest().version;
function optionsToForm(options)
{
  Object.keys(options).forEach((name) => {
    var el = document.getElementById(name);
    if (!el) return;
    switch (typeof(options[name]))
    {
      case 'boolean':
        el.checked = options[name];
        break;
      case 'string':
      case 'number':
        el.value = options[name];
        break;
    }
  });
}
function copyToClipboard(text) {
  passwordInput.select();
  document.execCommand("copy");
  let current_datetime = new Date()
  let date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
  json={
    'date': date,
    'password': passwordInput.value
  };
  pwd="Password:"+passwordInput.value;
  obj={
    [pwd]: json
  };
  browser.storage.local.set(obj);

}
function toggle()
{
  if(passwordInput.type=="password")
  {
    passwordInput.type="text";
    visible.src = 'images/hide.png';

  }
  else{
    passwordInput.type="password";
    visible.src = 'images/show.png';

  }
}
function validateOptions() {
  var inputIsInvalid = !uppercase.checked && !lowercase.checked && !numbers.checked && !symbols.checked && !specialChars.checked;

  generate.disabled = inputIsInvalid;
  remind.disabled = inputIsInvalid;
  if(inputIsInvalid)
  {
      if(noRepeat||excludeChars)
      {
        generate.disabled = true;
        remind.disabled = true;
      }
  }

}

function generatePassword(){
  var options;
  var lowerPool = 'abcdefghijklmnopqrstuvwxyz';
  var upperPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var numberPool = '0123456789';
  var symbolPool = '@#$%^&*()+-=!_';
  var specialCharPool = '~`{}[]|\\\"\':;?/><.,'
  var length=Number(document.getElementById('length').value);
  if(length<6)
  {
    alert("The minimum password length is 6");
    return;
  }
  
    options = {
      lowercase: document.getElementById('lowercase').checked,
      uppercase: document.getElementById('uppercase').checked,
      numbers: document.getElementById('numbers').checked,
      symbols: document.getElementById('symbols').checked,
      specialChar: document.getElementById('specialChars').checked,
      noRepeat: document.getElementById('noRepeat').checked,
      excludeChars: document.getElementById('excludeChars').checked,
      excludeInput: document.getElementById('excludeInput').value,
      length: length
    };
    excludePool = options.excludeInput;

    charPool = '';
    if (options.lowercase)
      charPool += lowerPool;
    if (options.uppercase)
      charPool += upperPool;
    if (options.numbers)
      charPool += numberPool;
    if (options.specialChar)
      charPool += specialCharPool;
    if (options.symbols)
      charPool += symbolPool;
    if (options.excludeChars)
    {
      var removeReg=new RegExp(excludePool,'g')
      charPool = charPool.replace(removeReg, "");
    }
    
   
  if(options.noRepeat)
  {
    if(charPool.length<length)
    {
      alert("With your current setting, the password length should not exceed "+charPool.length+" characters");
    }
  }
  do
  {
    var password = "";

    for (i = 0; i < length; i++)
    {
      password += charPool[GetRandomInt(0, charPool.length)];	// Picking random characters
      if (options.noRepeat)
        charPool = charPool.replace(password[i], "");
    }
  }
  while (!((!options.uppercase || ContainsAny(password, upperPool)) &&
      (!options.lowercase || ContainsAny(password, lowerPool)) &&
      (!options.numbers || ContainsAny(password, numberPool)) &&
      (!options.specialChars || ContainsAny(password, specialCharPool)) &&
      (!options.symbols || ContainsAny(password, symbolPool))));

  passwordInput.value=password;
  browser.storage.local.set(options);

}

function GetRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

function ContainsAny(array1, array2)
{
	for(var k = 0; k < array2.length; k++)
		if (array1.includes(array2[k]))
			return true;

	return false;
}
function viewHistory()
{
  browser.tabs.create({url: browser.extension.getURL('history.html')});
}
visible.addEventListener('click',toggle);
copy.addEventListener('click', copyToClipboard);
remind.addEventListener('click',viewHistory);
uppercase.addEventListener('click', validateOptions);
lowercase.addEventListener('click', validateOptions);
numbers.addEventListener('click', validateOptions);
symbols.addEventListener('click', validateOptions);
noRepeat.addEventListener('click', validateOptions);
specialChars.addEventListener('click', validateOptions);
excludeChars.addEventListener('click', validateOptions);
viewHis.addEventListener('click',viewHistory);
excludeInput.addEventListener('input', () => {
  excludeChars.checked = true;
});


generate.addEventListener("click",generatePassword);
browser.storage.local.get(Object.keys(defaultOptions)).then((userOptions) => {
  optionsToForm(Object.assign({}, defaultOptions, userOptions));
  document.body.style = '';
});
