import {ParamListBase} from '@react-navigation/native';

import {RouteNames} from './RouteNames';

export interface NavigationParamsList extends ParamListBase {
  //Stacks
  [RouteNames.landing]: undefined;
  [RouteNames.discover]: undefined;
  [RouteNames.favorites]: undefined;
  [RouteNames.profile]: undefined;
  [RouteNames.chat]: undefined;
  [RouteNames.library]: undefined;
  [RouteNames.store]: undefined;

  //screens-independent

  //landing-stack-screens
  [RouteNames.landing]: undefined;
  [RouteNames.singlePost]: {
    focus?: boolean | undefined;
    id: string | undefined;
  };
  [RouteNames.productInfo]: {
    productId: string;
  }
  [RouteNames.sellNow]: {
    categories: string[];
  }
  //favorites-stack-screens
  [RouteNames.favorites]: undefined;

  //profile-stack-screen
  [RouteNames.profile]: undefined;

  [RouteNames.addresses]: {
    shipping?: boolean;
  };

  [RouteNames.webProfileScreens]: {
    page: string;
  };
}
