var defaultOptions = {
    upper_case: true,
    lower_case: true,
    numbers: true,
    symbols: false,
    repeat: false,
    other: false,
    exclude: false,
    length: 10,
  };
var copy = document.getElementById('copy');
var visible= document.getElementById('visible');
var passwordInput = document.getElementById("passwordInput");
var upperCase=document.getElementById("uppercase");
var lowerCase=document.getElementById("lowercase");
var numbers=document.getElementById("numbers");
var symbols=document.getElementById("symbols");
var noRepeat=document.getElementById("dontRepeatChars");
var specialChars=document.getElementById("specialChars");
var excludeChars=document.getElementById("excludeChars");
var generate=document.getElementById("generate");
var remind=document.getElementById("reminder");
var excludeInput=document.getElementById("exclude");

document.getElementById("version_name").innerHTML=browser.runtime.getManifest().version;

function copyToClipboard(text) {
  passwordInput.select();
  document.execCommand("copy");
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
  var inputIsInvalid = !upperCase.checked && !lowerCase.checked && !numbers.checked && !symbols.checked && !specialChars.checked;

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
  for (;;) {
    options = {
      lower: document.getElementById('lowercase').checked,
      upper: document.getElementById('uppercase').checked,
      numbers: document.getElementById('numbers').checked,
      symbols: document.getElementById('symbols').checked,
      specialChar: document.getElementById('specialChars').checked,
      nonRepeat: document.getElementById('dontRepeatChars').checked,
      excludeChars: document.getElementById('excludeChars').checked,
      excludeVal: document.getElementById('exclude').value,
      length: length,
    };
    excludePool = options.excludeVal;

    charPool = '';
    if (options.lower)
      charPool += lowerPool;
    if (options.upper)
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
    
    if (charPool)
      break;
  }
  if(options.nonRepeat)
  {
    if(charPool.length<length)
    {
      alert("With your current setting, the password length should not exceed "+charPool.length+" characters");
    }
  }
  
  let password = [], rands = [], rand = 0;
  for (let index = 0; index < length; index++) {

      // too prevent the charac repeat
      do {
          rand = Math.floor(Math.random() * charPool.length);
      } while (rands.includes(rand) && rands.length < charPool.length);

      rands.push(rand);
      password.push(charPool[rand]);
  }
  var result=password.join('');
  passwordInput.value=result;
}

visible.addEventListener('click',toggle);
copy.addEventListener('click', copyToClipboard);

upperCase.addEventListener('click', validateOptions);
lowerCase.addEventListener('click', validateOptions);
numbers.addEventListener('click', validateOptions);
symbols.addEventListener('click', validateOptions);
noRepeat.addEventListener('click', validateOptions);
specialChars.addEventListener('click', validateOptions);
excludeChars.addEventListener('click', validateOptions);
excludeInput.addEventListener('click', validateOptions);

excludeInput.addEventListener('input', () => {
  excludeChars.checked = true;
});

generate.addEventListener("click",generatePassword);

