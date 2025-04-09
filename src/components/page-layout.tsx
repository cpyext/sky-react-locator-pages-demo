import Header from "./header";
import Footer from "./footer";
import {
  HeadlessConfig,
  SearchHeadlessProvider,
  provideHeadless,
} from "@yext/search-headless-react";
import searchConfig from "./searchConfig";
import { useState } from "react";
import { ChatHeadlessProvider, ChatConfig } from "@yext/chat-headless-react";
import "@yext/chat-ui-react/bundle.css";
import { ChatPopUp } from "@yext/chat-ui-react";
import Ce_site from "../types/site";
type Props = {
  _site?: Ce_site;
  children?: React.ReactNode;
};
const chatConfig: ChatConfig = {
  apiKey: import.meta.env.YEXT_PUBLIC_CHAT_APIKEY,
  botId: import.meta.env.YEXT_PUBLIC_CHAT_BOTID,
};
const PageLayout = ({ _site, children }: Props) => {
  console.log(_site);

  return (
    <div className="min-h-screen">
      <Header _site={_site} />
      <div className="py-8">
        <SearchHeadlessProvider searcher={provideHeadless(searchConfig)}>
          {children}
        </SearchHeadlessProvider>
      </div>
      <Footer _site={_site}></Footer>
      {import.meta.env.YEXT_PUBLIC_CHAT_APIKEY &&
        import.meta.env.YEXT_PUBLIC_CHAT_BOTID && (
          <ChatHeadlessProvider config={chatConfig}>
            <ChatPopUp
              title="Locator Chat"
              stream={false}
              customCssClasses={{
                buttonIcon: "text-white",
                button: "chatHeaderAndBotResponseColors",
                panelCssClasses: {
                  messageBubbleCssClasses: {
                    text: "text-base",
                    text__user: "chatHeaderAndBotResponseColors",
                    bubble__user: "chatHeaderAndBotResponseColors",
                  },

                  inputCssClasses: {
                    sendButton: "chatHeaderAndBotResponseColors",
                    textArea: "chatTextboxColor",
                  },
                },
                headerCssClasses: {
                  container: "chatHeaderAndBotResponseColors",
                  title: "overflow-hidden",
                },
              }}
            />
          </ChatHeadlessProvider>
        )}
    </div>
  );
};

export default PageLayout;
