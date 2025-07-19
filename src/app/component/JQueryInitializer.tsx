'use client';

import { useEffect } from 'react';
import jQuery from 'jquery';

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

const JQueryInitializer = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.$ = window.jQuery = jQuery;
    }
  }, []);

  return null;
};

export default JQueryInitializer;