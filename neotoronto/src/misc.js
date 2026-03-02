// HTTP UI, https://httpui.com/
// Copyright (C) Alex Morales, 2026
//
// Unless otherwise stated in particular files or directories, this software is free software.
// You can redistribute it and/or modify it under the terms of the GNU Affero
// General Public License as published by the Free Software Foundation, either
// version 3 of the License, or (at your option) any later version.

export const attrIsTrue = a => {
  if(!a)
    return false;
  
  const s = String(a.value).toLowerCase();

  if(
       s === 'undefined'
    || s === 'null'
    || s === 'false'
    || s === '0'
  )
    return false;
  
  return true;
};

export const oklchaToCSS = oklcha => 'oklch(' + oklcha.l + ' ' + oklcha.c + ' ' + oklcha.h + ' / ' + oklcha.a + ')';
