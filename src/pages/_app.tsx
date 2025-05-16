import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSkull, faUser } from "@fortawesome/free-solid-svg-icons";

library.add(faSkull, faUser);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
