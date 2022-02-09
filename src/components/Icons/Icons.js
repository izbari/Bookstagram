import React from 'react';
import AddIcon from '../../assets/svg/Add.svg';
import CardIcon from '../../assets/svg/Card.svg';
import CommentIcon from '../../assets/svg/Comment.svg';
import CreditCardIcon from '../../assets/svg/CreditCard.svg';
import FilledLikeIcon from '../../assets/svg/FilledLike.svg';
import HomeIcon from '../../assets/svg/Home.svg';
import LanguageIcon from '../../assets/svg/Language.svg';
import LikeIcon from '../../assets/svg/Like.svg';
import LogoutIcon from '../../assets/svg/Logout.svg';
import MessageIcon from '../../assets/svg/Message.svg';
import NotificationIcon from '../../assets/svg/Notification.svg';
import SendIcon from '../../assets/svg/Send.svg';
import ShareIcon from '../../assets/svg/Share.svg';
import ThemeIcon from '../../assets/svg/Theme.svg';
import ThreedotIcon from '../../assets/svg/Threedot.svg';
import UserIcon from '../../assets/svg/User.svg';
import LibraryIcon from '../../assets/svg/Library.svg';
import SearchIcon from '../../assets/svg/Search.svg';
import DragIcon from '../../assets/svg/Drag.svg';
import NewMessageIcon from '../../assets/svg/NewMessage.svg';
import BackArrowIcon from '../../assets/svg/ArrowBack.svg';
import CheckMarkIcon from '../../assets/svg/CheckMark.svg';
import FilterIcon from '../../assets/svg/Filter.svg';
import SortIcon from '../../assets/svg/Sort.svg';
import ExpandMoreIcon from '../../assets/svg/ExpandMore.svg';
export default function Icons({name,size,fill,style}) {
    
const Icons = {
    Add:AddIcon,
    Card:CardIcon,
    Comment:CommentIcon,
    CreditCard:CreditCardIcon,
    FilledLike:FilledLikeIcon,
    Home:HomeIcon,
    Language:LanguageIcon,
    Like:LikeIcon,
    Logout:LogoutIcon,
    Message:MessageIcon,
    Notification:NotificationIcon,
    Send:SendIcon,
    Share:ShareIcon,
    Theme:ThemeIcon,
    Threedot:ThreedotIcon,
    User:UserIcon,
    Library:LibraryIcon,
    Search:SearchIcon,
    Drag:DragIcon,
    NewMessage:NewMessageIcon,
    BackArrow:BackArrowIcon,
    CheckMark:CheckMarkIcon,
    Sort:SortIcon,
    Filter:FilterIcon,
    ExpandMore:ExpandMoreIcon,
  }
  const Icon = Icons[name];
  return <Icon width={size} height={size} fill={fill} style={style} />;
}