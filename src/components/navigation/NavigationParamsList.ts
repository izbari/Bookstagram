import {ParamListBase} from '@react-navigation/native';

import {RouteNames} from './RouteNames';

export interface NavigationParamsList extends ParamListBase {
  //Stacks
  [RouteNames.landing]: undefined;
  [RouteNames.discover]: undefined;
  [RouteNames.favorites]: undefined;
  [RouteNames.profileMain]: undefined;
  [RouteNames.chat]: undefined;
  [RouteNames.library]: undefined;
  [RouteNames.store]: undefined;
  [RouteNames.myStore]: undefined;

  //screens-independent

  //landing-stack-screens
  [RouteNames.landing]: undefined;
  [RouteNames.singlePost]: {
    focus?: boolean | undefined;
    id: string | undefined;
  };
  [RouteNames.productInfo]: {
    productId: string;
  };
  [RouteNames.sellNow]: {
    categories: string[];
  };
  [RouteNames.bookDetail]: {
    id: string;
  };
  [RouteNames.singleChat]: {
    targetUserId: string;
    chatId: string;
    name: string;
    avatar: string;
  };
  //favorites-stack-screens
  [RouteNames.favorites]: undefined;

  //profile-stack-screen
  [RouteNames.profileStack]: undefined;
  [RouteNames.profileSettings]: undefined;

  [RouteNames.addresses]: {
    shipping?: boolean;
  };

  [RouteNames.webProfileScreens]: {
    page: string;
  };
}
