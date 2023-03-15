import Label from "components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import Avatar from "shared/Avatar/Avatar";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { changeAuthor, changeDetailedUserInfo, selectCurrentAuthorization, selectCurrentUser, selectCurrentWallet, selectDetailedUser, selectGlobalProvider } from "app/reducers/auth.reducers";
import { config } from "app/config";

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {

  const currentUsr = useAppSelector(selectCurrentUser);
  const globalAddress = useAppSelector(selectCurrentWallet);
  const detailedInfo = useAppSelector(selectDetailedUser);
  const currentAuthState = useAppSelector(selectCurrentAuthorization);

  const [logoImg, setLogoImg] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [bioText, setBioText] = useState("");
  const [websiteText, setWebsiteText] = useState("");
  const [facebookText, setFacebookText] = useState("");
  const [twitterText, setTwitterText] = useState("");
  const [telegramText, setTelegramText] = useState("");
  const [spotifyText, setSpotifyText] = useState("");
  const [instagramText, setInstagramText] = useState("");
  const [soundCloudText, setSoundCloudText] = useState("");
  const [bandcampText, setBandcampText] = useState("");
  const [walletAccountText, setWalletAccountText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNameText(currentUsr?.username || "");
    setEmailText(currentUsr?.email?.toString() || "");
    setBioText(currentUsr?.userBio?.toString() || "");
    setEmailText(currentUsr?.email?.toString() || "");
    setWebsiteText(currentUsr?.websiteURL?.toString() || "");
    setFacebookText(currentUsr?.facebook?.toString() || "");
    setTwitterText(currentUsr?.twitter?.toString() || "");
    setTelegramText(currentUsr?.telegram?.toString() || "");
    setSpotifyText(currentUsr?.spotify?.toString() || "");
    setInstagramText(currentUsr?.instagram?.toString() || "");
    setSoundCloudText(currentUsr?.soundcloud?.toString() || "");
    setBandcampText(currentUsr?.bandcamp?.toString() || "");
    setWalletAccountText(currentUsr?.address?.toString() || "");
    setLogoImg(`${config.API_URL}uploads/${currentUsr?.avatar}` || "");
  }, []);

  const changeAvatar = (event: any) => {
    var file = event.target.files[0];
    if (file == null) return;
    setSelectedAvatarFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader.result?.toString() || "");
    };
    reader.onerror = function (error) {
    }
  }

  function ValidateEmail(email: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return (true)
    }
    return (false)
  }

  function ValidateWalletAccount(walletAccount: string) {
    if (/^0x[a-fA-F0-9]{40}$/.test(walletAccount)) {
      return (true)
    }
    return (false)
  }

  function ValidateWebsiteLink(weblink: string) {
    if (/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/.test(weblink)) {
      return (true)
    }
    return (false)
  }

  const onClickUpdate = async () => {
    const params = {
      email: emailText,
      address: walletAccountText,
      username: nameText,
      websiteURL: websiteText,
      userBio: bioText,
      verified: true,
      banner: "",
      twitter: twitterText,
      facebook: facebookText,
      telegram: telegramText,
      spotify: spotifyText,
      instagram: instagramText,
      soundcloud: soundCloudText,
      bandcamp: bandcampText,
      avatar: logoImg.split(`${config.API_URL}uploads/`)[1]
    };
    if (emailText !== "") {
      let correct = ValidateEmail(emailText);
      if (!correct) {
        toast.error("Invalid email.");
        params.email = "";
        return;
      }
    }
    if (walletAccountText !== "") {
      let correct = ValidateWalletAccount(walletAccountText);
      // if (!correct) {
      //   toast.error("Invalid wallet account.");        
      //   params.address = "";
      //   return;
      // }
    }
    else {
      toast.warn("Wallet account can not be empty.");
      return;
    }
    if (nameText === "") {
      toast.warn("Username can not be empty.");
      return;
    }
    params.username = nameText;
    if (websiteText !== "") {
      let correct = ValidateWebsiteLink(websiteText)
      if (!correct) {
        toast.warn("Invalid custom url.");
        params.websiteURL = "";
        return;
      }
    }
    else params.websiteURL = "";
    if (selectedAvatarFile == null) {
      params.avatar = logoImg.split(`${config.API_URL}uploads/`)[1] || "";
    }
    if (selectedAvatarFile && selectedAvatarFile !== "") {
      const formData = new FormData();
      formData.append("itemFile", selectedAvatarFile || "");
      formData.append("authorId", "hch");
      await axios({
        method: "post",
        url: `${config.API_URL}api/utils/upload_file`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(async function (response) {
          params.avatar = response.data.path;
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Uploading photo failed.");
        });
    }
    await axios.post(
      `${config.API_URL}api/users/update`,
      {
        ...params,
        _id: currentUsr?._id
      },
      {
        headers:
        {
          "x-access-token": localStorage.getItem("jwtToken")
        }
      }
    )
      .then(function (response) {
        if (response.data.code === 0) {
          if (currentUsr && currentUsr._id) {
            axios.post(`${config.API_URL}api/users/findOne`,
              { userId: currentUsr._id },
              {
                headers:
                {
                  "x-access-token": localStorage.getItem("jwtToken")
                }
              }).then((result) => {
                dispatch(changeAuthor(result.data.data));
                dispatch(changeDetailedUserInfo(result.data.data));
                toast.success("Successfully updated the profile")
                navigate("/");
              }).catch(() => {
                console.log("Get detailed userInfo failed.");
              });
          }
        }
        else {
          toast.warn(response.data.message);
        }
      })
      .catch(function (error) {
        toast.error(error);
      });
  }

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Account || Rize2Day</title>
      </Helmet>
      <div className="container">
        <div className="max-w-4xl mx-auto my-12 space-y-8 sm:lg:my-16 lg:my-24 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Profile settings
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-600"></div>
          <div className="flex flex-col md:flex-row">
            <div className="flex items-start flex-shrink-0">
              <div className="relative flex overflow-hidden rounded-full">
                <Avatar sizeClass="w-32 h-32" imgUrl={logoImg} />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black cursor-pointer bg-opacity-60 text-neutral-50">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => changeAvatar(e)}
                />
              </div>
            </div>
            <div className="flex-grow max-w-3xl mt-10 space-y-5 md:mt-0 md:pl-16 sm:space-y-6 md:sm:space-y-7">
              {/* ---- */}
              <div>
                <Label>Username</Label>
                <Input className="mt-1.5" placeholder="Eden Tuan" value={nameText} onChange={(e) => setNameText(e.target.value)} />
              </div>

              {/* ---- */}
              <div>
                <Label>Email</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-envelope"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    placeholder="example@email.com"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                  />
                </div>
              </div>

              {/* ---- */}
              <div>
                <Label>Bio</Label>
                <Textarea
                  rows={5}
                  className="mt-1.5"
                  placeholder="Something about yourself in a few words."
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                />
              </div>

              {/* ---- */}


              {/* ---- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-2.5">
                <div className="mt-2">
                  <Label>Website</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-globe-americas"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourwebsite.com"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={websiteText}
                      onChange={(e) => setWebsiteText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Facebook</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-facebook-f"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourfacebook"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={facebookText}
                      onChange={(e) => setFacebookText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Twitter</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-twitter"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourtwitter"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={twitterText}
                      onChange={(e) => setTwitterText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Telegram</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-telegram-plane"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourtelegram"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={telegramText}
                      onChange={(e) => setTelegramText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Spotify</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-spotify"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourspotify"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={spotifyText}
                      onChange={(e) => setSpotifyText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Instagram</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-instagram"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourinstagram"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={instagramText}
                      onChange={(e) => setInstagramText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Soundcloud</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-soundcloud"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yoursoundcloud"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={soundCloudText}
                      onChange={(e) => setSoundCloudText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Bandcamp</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl lab la-bandcamp"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="yourbandcamp"
                      sizeClass="h-11 px-4 pl-2 pr-3"
                      value={bandcampText}
                      onChange={(e) => setBandcampText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ---- */}
              <div>
                <Label>Wallet Address</Label>
                <div className="mt-1.5 relative text-neutral-700 dark:text-neutral-300">
                  <Input
                    className="!pr-10 "
                    placeholder="0x1bde388826caab77bfe80148abdce6830606e2c6"
                    value={walletAccountText}
                    onChange={(e) => setWalletAccountText(e.target.value)}
                  />

                  <span className="absolute right-2.5 cursor-pointer top-1/2 -translate-y-1/2 ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* ---- */}
              <div className="pt-2">
                <ButtonPrimary className="w-full" onClick={() => { onClickUpdate() }}>Update profile</ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
