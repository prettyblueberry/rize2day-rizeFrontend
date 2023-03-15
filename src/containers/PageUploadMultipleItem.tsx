import Label from "components/Label/Label";
import styles from "../containers/Collections/UploadDetails.module.sass";
import React, { FC, useState, useEffect } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import { Helmet } from "react-helmet";
import FormItem from "components/FormItem";
import { RadioGroup, Switch } from "@headlessui/react";
import { nftsImgs } from "contains/fakeData";
import MySwitch from "components/MySwitch";
import axios from "axios";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  changeCollectionList,
  CollectionData,
  selectConllectionList,
  selectConsideringCollectionId,
} from "app/reducers/collection.reducers";
import {
  selectCurrentChainId,
  selectCurrentUser,
  selectCurrentWallet,
  selectDetailedUser,
  selectGlobalProvider,
  selectWalletStatus,
} from "app/reducers/auth.reducers";
import { Navigate, useNavigate } from "react-router-dom";
import { isEmpty, hasKey } from "app/methods";
import { config } from "app/config.js";
import {
  changeTradingResult,
  selectCurrentTradingResult,
} from "app/reducers/nft.reducers";
// import { batchMintOnSale, singleMintOnSale } from "InteractWithSmartContract/interact";
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";
import Radio from "shared/Radio/Radio";
import Checkbox from "@mui/material/Checkbox";
import Dropdown from "../components/Dropdown";
import FormControlLabel from "@mui/material/FormControlLabel";
// import DateTimePicker  from 'react-datetime-picker';
import SchemaList from "components/SchemaList";
import { useSigningClient } from "app/cosmwasm";
import { FILE_TYPE } from "app/config.js";
import { pinFileToIPFS, pinJSONToIPFS } from "utils/pinatasdk";

const DEFAULT_SCHEMA = {
  attributes: [],
};

export interface PageUploadItemProps {
  className?: string;
}

const plans = [
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[0],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[1],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[2],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[3],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[4],
  },
  {
    name: "Crypto Legend - Professor",
    featuredImage: nftsImgs[5],
  },
];

const fileCategories = [
  { value: 0, text: "All" },
  { value: 1, text: "Image" },
  { value: 2, text: "Audio" },
  { value: 3, text: "Video" },
  { value: 4, text: "3D file" },
];

const PageUploadItem: FC<PageUploadItemProps> = ({ className = "" }) => {
  const consideringCollectionId = useAppSelector(selectConsideringCollectionId);
  const currentUsr = useAppSelector(selectCurrentUser);
  const globalAddress = useAppSelector(selectCurrentWallet);
  const detailedUserInfo = useAppSelector(selectDetailedUser);
  const collections = useAppSelector(selectConllectionList);
  const tradingResult = useAppSelector(selectCurrentTradingResult);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalProvider = useAppSelector(selectGlobalProvider);
  const currentChainId = useAppSelector(selectCurrentChainId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [sale, setSale] = useState(false);
  const [selected, setSelected] = useState({ name: "", _id: "", address: "" });
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [collectionId, setCollectionId] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [selectedMusicFileName, setSelectedMusicFileName] = useState("");
  const [selectedMusicFile, setSelectedMusicFile] = useState(null);

  const [logoImg, setLogoImg] = useState("");
  const [textName, setTextName] = useState("");
  const [textWebsite, setTextWebsite] = useState("");
  const [textDescription, setTextDescription] = useState("");
  const [colls, setColls] = useState(Array<CollectionData>);
  const [auction, setAuction] = useState(false);
  const [period, setPeriod] = useState(0);
  const [price, setPrice] = useState(0);
  const [sel_files, setSelFiles] = useState([]);
  const [sel_MultiMediafiles, setSelMutilMediaFiles] = useState([]);
  const [sel_JsonFiles, setSelJsonFiles] = useState([]);
  const [stockAmount, setStockAmount] = useState(1);
  const [timeLength, setTimeLength] = useState(0);
  const [working, setWorking] = useState(false);
  const [auctionEndTime, setAuctionEndTime] = useState<Date | null>(new Date());
  const { mintNFT, collectionConfig, batchMint, balances }: any =
    useSigningClient();
  const [fileCategory, setFileCategory] = useState(1); //0: image, 1: music, 2: video

  const [schemaData, setSchemaData] = useState(DEFAULT_SCHEMA);
  const [metaData, setMetaData] = useState([]);
  const [nftItems, setNftItems] = useState([]);
  const [jsonItems, setJsonItems] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [validation, setValidation] = useState(false);

  useEffect(() => {
    //check the current user, if ther user is not exists or not verified, go back to the home
    if (
      isEmpty(currentUsr) ||
      (!isEmpty(detailedUserInfo) &&
        !isEmpty(detailedUserInfo?.verified) &&
        !detailedUserInfo?.verified)
    ) {
      toast.warn("Please connect your wallet first.");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (collections && collections.length > 0) {
      let tempOptions: any = [];
      collections.map((coll, index) => {
        if (coll.collectionNumber && coll.collectionNumber >= 0) {
          tempOptions.push({
            _id: coll?._id || "",
            name: coll?.name || "",
            bannerURL: coll?.bannerURL || "",
            address: coll?.address || "",
            cw721address: coll?.cw721address || "",
            collectionNumber: coll?.collectionNumber || "",
          });
        }
      });
      setColls(tempOptions);
    }
  }, [collections]);

  useEffect(() => {
    if (currentUsr?._id) {
      axios
        .post(
          `${config.API_URL}api/collection/getUserCollections`,
          { limit: 90, userId: currentUsr?._id },
          {
            headers: {
              "x-access-token": localStorage.getItem("jwtToken"),
            },
          }
        )
        .then((result) => {
          dispatch(changeCollectionList(result.data.data));
        })
        .catch((err: any) => {
          console.log("error getting collections : ", err);
        });
    }
  }, [currentUsr]);

  useEffect(() => {
    if (tradingResult) {
      switch (tradingResult.function) {
        default:
          break;
        case "singleMintOnSale":
          dispatch(
            changeTradingResult({ function: "", success: false, message: "" })
          );
          if (tradingResult.success === false)
            toast.error(tradingResult.message);
          break;
        case "batchMintOnSale":
          dispatch(
            changeTradingResult({ function: "", success: false, message: "" })
          );
          if (tradingResult.success === false)
            toast.error(tradingResult.message);
          break;
      }
    }
  }, [tradingResult]);

  const onChangePrice = (e: any) => {
    var inputedPrice = e.target.value;
    if (inputedPrice !== "") {
      let correct = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(inputedPrice);
      if (correct !== true) return;
    }
    setPrice(inputedPrice);
  };

  const onChangeStockAmount = (e: any) => {
    var inputAmount = e.target.value;
    if (inputAmount !== "") {
      let correct = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(inputAmount);
      if (correct !== true) return;
    }
    setStockAmount(Math.ceil(inputAmount) || 1);
  };

  const changeFile = async (event: any) => {
    var file = event.target.files[0];
    if (file == null) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.warn("Image file size should be less than 100MB");
      return;
    }
    setSelFiles([...event.target.files]);
    setSelectedFile(file);
    setSelectedFileName(file.name);

    if (fileCategory === FILE_TYPE.IMAGE) {
      const files = event.target.files;
      const list = [];
      for (let i = 0; i < files.length; i++) {
        list.push(files[i].name);
      }
      setNftItems(list);
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader?.result?.toString() || "");
    };
    reader.onerror = function (error: any) {
      console.log("banner file choosing error : ", error);
    };
  };

  const checkNativeCurrencyAndTokenBalances = async (tokenAmountShouldPay) => {
    if (
      balances[config.COIN_MINIMAL_DENOM] <= 0 ||
      (tokenAmountShouldPay > 0 && balances.cw20 <= tokenAmountShouldPay)
    ) {
      toast.warn("Insufficient TESTCORE or RIZE");
      return false;
    }
    return true;
  };

  const saveMultipleItem = async (params: any, paths: any) => {
    setWorking(true);
    const metas = [];
    const names = [];
    for (let idx = 0; idx < paths.length; idx++) {
      names.push(textName + " #" + `${idx + 1}`.padStart(3, "0"));

      if (sel_JsonFiles.length > 0) {
        const metaList = [];
        const attributes = sel_JsonFiles[idx].attributes;
        for (let j = 0; j < attributes.length; j++) {
          const meta = {
            key: "",
            value: null,
          };
          const attribute = attributes[j];
          meta.key = attribute.trait_type;
          meta.value = attribute.value;
          metaList.push(meta);
        }
        metas.push(metaList);
      }
    }
    axios
      .post(`${config.API_URL}api/item/multiple_create`, {
        params,
        names,
        paths,
        metas,
      })
      .then(async function (response) {
        if (response.status === 200) {
          toast.success("All items were saved.");
          const IdArray = [...response.data];
          var prices = [];
          for (let idx = 0; idx < IdArray.length; idx++) prices[idx] = 0;
          //do transaction
          try {
            let colllectionInfo = await collectionConfig(selected.address);
            let startId = colllectionInfo.unused_token_id;
            let balanceCheck = await checkNativeCurrencyAndTokenBalances(0);
            if (balanceCheck === false) {
              axios
                .post(`${config.API_URL}api/item/deleteManyByIds`, {
                  idArray: IdArray,
                })
                .then((response) => {})
                .catch((error) => {
                  console.log(error);
                });
              return;
            }
            let txHash = await batchMint(
              currentUsr.address,
              selected.address,
              params.metadataURIs,
              names
            );
            //succeed, then update all items with token ids
            if (txHash == -1) {
              toast.error("Network error.");
              axios
                .post(`${config.API_URL}api/item/deleteManyByIds`, {
                  idArray: IdArray,
                })
                .then((response) => {})
                .catch((error) => {
                  console.log(error);
                });
            } else {
              axios
                .post(`${config.API_URL}api/item/updateTokenIds`, {
                  idArray: IdArray,
                  startTokenId: startId,
                })
                .then((response) => {
                  if (response.data.code === 0) {
                    toast.success("You've created NFTs sucessfully.");
                    navigate("/page-author/" + currentUsr?._id);
                  }
                })
                .catch((error) => {
                  toast.error("Server side error.");
                });
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
            //if tx fail, then delete all items on DB
            axios
              .post(`${config.API_URL}api/item/deleteManyByIds`, {
                idArray: IdArray,
              })
              .then((response) => {})
              .catch((error1) => {
                console.log(error1);
              });
          }
          setWorking(false);
        } else {
          setWorking(false);
          console.log(
            "Failed in multiple items uploading : " + response.data.message
          );
          toast.error("Failed in multiple items uploading");
        }
      })
      .catch(function (error: any) {
        setWorking(false);
        console.log("Failed in multiple items uploading : " + error);
        toast.error("Failed in multiple items uploading");
      });
  };

  useEffect(() => {
    setCollectionId((selected as any)._id || "");
    setCollectionName((selected as any).text || "");
  }, [selected]);

  useEffect(() => {
    if (collectionId !== undefined && collections && collections.length > 0) {
      var index = collections.findIndex((element) => {
        return element._id.toString() === collectionId.toString();
      });

      if (collections[index] && (collections[index] as any).metaData) {
        const metaTemplateArry = (collections[index] as any).metaData;
        setMetaData(metaTemplateArry);

        const defaultSchema = DEFAULT_SCHEMA;
        const attributes = [];
        for (let i = 0; i < metaTemplateArry.length; i++) {
          const metaTemp = metaTemplateArry[i];
          const meta = {
            trait_type: metaTemp.trait_type,
            value:
              metaTemp.property.length > 0
                ? metaTemp.property[0]
                : metaTemp.type.text === "boolean"
                ? false
                : "",
          };
          attributes.push(meta);
        }
        defaultSchema.attributes = attributes;
        setSchemaData(defaultSchema);
      }
    }
  }, [collectionId, collections]);

  const createItem = async () => {
    if (!validation && metaData?.length > 0) {
      toast.warn("Please try the validation");
      return;
    }
    if (sale) {
      if (Number(price) < 0.00001 || isNaN(Number(price))) {
        toast.error(
          "Invalid price. Price must be equal or higher than 0.00001"
        );
        return;
      } else {
        setPrice(Number(price));
      }
      if (
        globalAddress &&
        currentUsr &&
        currentUsr?.address &&
        currentUsr.address.toLowerCase().trim() ===
          globalAddress.toLowerCase().trim()
      ) {
      } else {
        toast.warn(
          "Minting wallet address should be a registered wallet address. Pleast connect a registed wallet when you used on sign up. "
        );
        return;
      }
    }
    if (isEmpty(currentUsr)) {
      toast.warn("You have to sign in before doing a trading.");
      return;
    }
    if (selectedMusicFile == null && fileCategory > 1) {
      if (fileCategory == FILE_TYPE.AUDIO)
        toast.warn("Music file is not selected.");
      if (fileCategory == FILE_TYPE.VIDEO)
        toast.warn("Video file is not selected.");
      if (fileCategory == FILE_TYPE.THREED)
        toast.warn("3D file is not selected.");
      return;
    }
    if (selectedFile == null) {
      toast.warn("Image is not selected.");
      return;
    }
    if (textName === "") {
      toast.error("Item name cannot be empty.");
      return;
    }
    if (isEmpty(selected) || selected.name === "") {
      toast.warn("Please select a collection and try again.");
      return;
    }
    if (stockAmount < 1) {
      toast.warn("Please input a valid stock amount.");
      return;
    }
    if (sale === true) {
      if (walletStatus === false) {
        toast.warn("Please connect your wallet and try again.");
        return;
      }
    }
    setWorking(true);
    try {
      var uploadedBannerPath = "";
      if (fileCategory !== FILE_TYPE.IMAGE) {
        var formData = new FormData();
        formData.append("itemFile", selectedFile);
        formData.append("authorId", "hch");
        formData.append("collectionName", selected?.name);

        await axios({
          method: "post",
          url: `${config.API_URL}api/utils/upload_file`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then(async function (response: any) {
            uploadedBannerPath = response.data.path;
          })
          .catch(function (error: any) {
            console.log("banner file uploading error : ", error);
            toast.error("Banner file uploading failed.");
            setWorking(false);
            return;
          });
      }
      var considering_files = [];
      considering_files = fileCategory > 1 ? sel_MultiMediafiles : sel_files;

      if (
        considering_files.length > 0 &&
        considering_files.length <= config.MAXIMUM_UPLOAD
      ) {
        console.log("sel_files = ", considering_files);
        let fileHash = null;
        let paths = [];
        let metadataTemp = {};
        let uriHash = null;
        let uris = [];
        for (var i = 0; i < considering_files.length; i++) {
          fileHash = await pinFileToIPFS(considering_files[i]);
          console.log("responseOfIpfs ===> ", fileHash);
          paths.push(fileHash);
          metadataTemp = {
            name: textName + " #" + `${i + 1}`.padStart(3, "0"),
            description: textDescription,
            image: `ipfs://${fileHash}`,
            attributes: [],
          };
          uriHash = await pinJSONToIPFS(metadataTemp);
          console.log("uriHash ===> ", uriHash);
          uris.push("ipfs://" + uriHash);
        }
        const params = {
          itemName: textName,
          itemMusicURL: paths[0],
          itemLogoURL:
            fileCategory !== FILE_TYPE.IMAGE ? uploadedBannerPath : paths[0],
          itemDescription: textDescription,
          collectionId: selected?._id || "",
          creator: currentUsr?._id || "",
          owner: currentUsr?._id || "",
          fileType: fileCategory,
          isSale: 0,
          price: !sale ? 0 : price,
          auctionPeriod: !sale ? 0 : period,
          stockAmount: stockAmount > 1 ? Math.floor(stockAmount) : 1,
          metaData: "",
          mutiPaths: paths,
          timeLength: timeLength,
          stockGroupId: new Date().getTime(),
          chainId: currentChainId || 1,
          metadataURIs: uris,
        };
        await saveMultipleItem(params, paths);
      } else {
        toast.warn(
          `You can not create more than ${config.MAXIMUM_UPLOAD} NFTs at once.`
        );
      }
    } catch (error) {
      toast.error("Network error");
      setWorking(false);
      return;
    }
  };

  const handlelChangeAuctionEndTime = (value: Date) => {
    if (value) {
      let dl = value.getTime() - Date.now();
      if (dl > 1000 * 60) {
        // bigger than 60s
        setAuctionEndTime(value);
        setPeriod(dl);
      } else {
        setAuctionEndTime(new Date());
      }
    }
  };

  const changeMusicFile = async (event: any) => {
    var file = event.target.files[0];
    if (file == null) return;
    if (fileCategory == FILE_TYPE.AUDIO) {
      if (file.size > 100 * 1024 * 1024) {
        setSelectedMusicFile(null);
        setSelectedMusicFileName("");
        toast.warn("Audio file size should be less than 100MB.");
        return;
      }
    }
    if (fileCategory == FILE_TYPE.VIDEO) {
      if (file.size > 100 * 1024 * 1024) {
        setSelectedMusicFile(null);
        setSelectedMusicFileName("");
        toast.warn("Video file size should be less than 100MB");
        return;
      }
      let reader1 = new FileReader();
      reader1.readAsDataURL(file);
      reader1.onload = () => {
        var videoElement = document.createElement("video");
        videoElement.src = file.name;
        var timer = setInterval(function () {
          if (videoElement.readyState === 4) {
            console.log(
              "The duration is: " +
                videoElement.duration.toFixed(2) +
                " seconds"
            );
            clearInterval(timer);
          }
        }, 500);
      };
      reader1.onerror = function (error: any) {
        console.log("music file choosing error : ", error);
      };
    }
    setSelMutilMediaFiles([...event.target.files]);
    setSelectedMusicFile(file);
    setSelectedMusicFileName(file.name);

    const files = event.target.files;
    const list = [];
    for (let i = 0; i < files.length; i++) {
      list.push(files[i].name);
    }
    setNftItems(list);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader?.result?.toString() || "");
    };
    reader.onerror = function (error: any) {
      console.log("music file choosing error : ", error);
    };
  };

  const readJsonFile = async (file: Blob) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string));
        }
      };

      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const changeJsonFile = async (event: any) => {
    var files = event.target.files;
    const list = [];
    const jsonList = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      list.push(file.name);
      const parsedData = await readJsonFile(file);
      jsonList.push(parsedData);
    }
    setJsonItems(list);
    setSelJsonFiles(jsonList);
  };

  const handleValidate = () => {
    if (nftItems.length === 0 || jsonItems.length === 0) {
      toast.warning("Please upload the NFT and JSON files");
      return;
    }
    if (nftItems.length !== jsonItems.length) {
      toast.warning("The count of files does not match");
      return;
    }

    const schema: any = schemaData.attributes;
    for (let i = 0; i < sel_JsonFiles.length; i++) {
      const jsonFile: any = sel_JsonFiles[i];
      if (!hasKey(jsonFile, "attributes")) {
        toast.error(
          <div>
            <p className="mb-0">JSON Validation is failed.</p>
            <p className="mb-0">
              No attributes property in{" "}
              <span className="text-red-400">{jsonItems[i]}</span>
            </p>
          </div>
        );
        return;
      }
      const json = jsonFile.attributes;
      if (schema.length !== json.length) {
        toast.error(
          <div>
            <p className="mb-0">JSON Validation is failed.</p>
            <p className="mb-0">
              No matched in the attributes length in{" "}
              <span className="text-red-400">{jsonItems[i]}</span>
            </p>
          </div>
        );
        return;
      }
      for (let j = 0; j < json.length; j++) {
        const json_attribute = json[j];
        if (!hasKey(json_attribute, "trait_type")) {
          toast.error(
            <div>
              <p className="mb-0">JSON Validation is failed.</p>
              <p className="mb-0">
                No trait_type property in{" "}
                <span className="text-red-400">{jsonItems[i]}</span>
              </p>
            </div>
          );
          return;
        }
        if (!hasKey(json_attribute, "value")) {
          toast.error(
            <div>
              <p className="mb-0">JSON Validation is failed.</p>
              <p className="mb-0">
                No value property in{" "}
                <span className="text-red-400">{jsonItems[i]}</span>
              </p>
            </div>
          );
          return;
        }
      }
      for (let k = 0; k < schema.length; k++) {
        const schema_attribute = schema[k];
        const json_attribute = json[k];
        if (
          metaData[k].required &&
          schema_attribute.trait_type !== json_attribute.trait_type
        ) {
          toast.error(
            <div>
              <p className="mb-0">JSON Validation is failed.</p>
              <p className="mb-0">
                No matched "{schema_attribute.trait_type}" type in{" "}
                <span className="text-red-400">{jsonItems[i]}</span>
              </p>
            </div>
          );
          return;
        }
        if (
          metaData[k].required &&
          metaData[k].type.text === "boolean" &&
          typeof json_attribute.value !== "boolean"
        ) {
          toast.error(
            <div>
              <p className="mb-0">JSON Validation is failed.</p>
              <p className="mb-0">
                No value "{json_attribute.value}" in{" "}
                <span className="text-red-400">{jsonItems[i]}</span>
              </p>
            </div>
          );
          return;
        }
        if (
          metaData[k].required &&
          (metaData[k].type.text === "string" ||
            metaData[k].type.text === "number") &&
          !metaData[k].property.includes(json_attribute.value)
        ) {
          toast.error(
            <div>
              <p className="mb-0">JSON Validation is failed.</p>
              <p className="mb-0">
                No value "{json_attribute.value}" in [
                {metaData[k]?.property?.join(", ")}] in{" "}
                <span className="text-red-400">{jsonItems[i]}</span>
              </p>
            </div>
          );
          return;
        }
      }
    }
    toast.success("Validation succeeded");
    setValidation(true);
  };

  return (
    <>
      <Helmet>
        <title>Create NFTs || Rize2Day </title>
      </Helmet>
      <div
        className={`nc-PageUploadItem ${className}`}
        data-nc-id="PageUploadItem"
      >
        <div className="container">
          <div className="max-w-4xl mx-auto my-12 space-y-8 sm:lg:my-16 lg:my-24 sm:space-y-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Create New NFTs
              </h2>
              <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                You can set preferred display name, create your profile URL and
                manage other personal settings.
              </span>
            </div>
            <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-600"></div>
            <h3 className="text-lg font-semibold sm:text-2xl ">
              File category
            </h3>
            <div className=" overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-neutral-600">
              <div className="relative flex px-5 py-6 space-x-10 justify-around">
                {fileCategories.map((item, index) => {
                  if (index > 0)
                    return (
                      <div key={index} className="">
                        <Radio
                          id={item.text}
                          name="radioFileCategories"
                          label={item.text}
                          defaultChecked={fileCategory === index}
                          onChange={(checked) => {
                            if (Boolean(checked) == true) {
                              setFileCategory(index);
                              setSelFiles([]);
                              setSelMutilMediaFiles([]);
                              setSelectedFile(null);
                              setSelectedMusicFile(null);
                              setSelectedFileName("");
                              setSelectedMusicFileName("");
                            }
                          }}
                        />
                      </div>
                    );
                })}
              </div>
            </div>
            <div className="mt-10 space-y-5 md:mt-0 sm:space-y-6 md:sm:space-y-8">
              <div>
                <h3 className="text-lg font-semibold sm:text-2xl">
                  {fileCategory < 2 ? "Image files" : "Preview image"}
                </h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  File types supported: PNG, JPEG, GIF, WEBP
                </span>
                <div className="mt-5 ">
                  <div className="relative flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-dashed border-neutral-300 dark:border-neutral-6000 rounded-xl">
                    <div className="space-y-1 text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-neutral-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300">
                        <span className="text-green-500">
                          {fileCategory > 1
                            ? "Upload a image file"
                            : "Upload image files"}
                        </span>
                        <label
                          htmlFor="file-upload2"
                          className="font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500 hover:bg-black/5 absolute top-0 left-0 w-full h-full"
                        >
                          {fileCategory > FILE_TYPE.IMAGE ? (
                            <input
                              id="file-upload2"
                              name="file-upload2"
                              type="file"
                              className="sr-only"
                              accept=".png,.jpeg,.jpg,.gif,.webp"
                              onChange={changeFile}
                            />
                          ) : (
                            <input
                              id="file-upload2"
                              name="file-upload2"
                              type="file"
                              className="sr-only"
                              accept=".png,.jpeg,.jpg,.gif,.webp"
                              onChange={changeFile}
                              multiple
                            />
                          )}
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {fileCategory > 1
                          ? !selectedFile
                            ? "Max 100MB."
                            : selectedFileName
                          : sel_files.length > 0
                          ? `You selected ${sel_files.length} files.`
                          : selectedFileName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {fileCategory > 1 && (
                <div>
                  <h3 className="text-lg font-semibold sm:text-2xl">
                    Audio/Video/3D file
                  </h3>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    File types supported: MP3, mp4
                  </span>
                  <div className="mt-5 ">
                    <div className="relative flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-dashed border-neutral-300 dark:border-neutral-6000 rounded-xl">
                      <div className="space-y-1 text-center">
                        <svg
                          className="w-12 h-12 mx-auto text-neutral-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <div className="flex justify-center text-sm text-center text-neutral-6000 dark:text-neutral-300">
                          <span className="text-green-500">
                            {fileCategory == FILE_TYPE.AUDIO &&
                              "Upload audio files"}
                            {fileCategory == FILE_TYPE.VIDEO &&
                              "Upload video files"}
                            {fileCategory == FILE_TYPE.THREED &&
                              "Upload 3D files"}
                          </span>
                          <label
                            htmlFor="file-upload"
                            className="font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500 hover:bg-black/5 absolute top-0 left-0 w-full h-full"
                          >
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".mp3,.MP3,.mp4,.MP4,.glb"
                              onChange={changeMusicFile}
                              multiple
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {sel_MultiMediafiles.length > 0
                            ? `You selected ${sel_MultiMediafiles.length} files.`
                            : selectedMusicFileName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <FormItem label="Item Name">
                <Input
                  value={textName}
                  onChange={(e) => setTextName(e.target.value)}
                />
              </FormItem>

              <FormItem
                label="Description"
                desc={
                  <div>
                    The description will be included on the item's detail page
                    underneath its image.{" "}
                    <span className="text-green-500">Markdown</span> syntax is
                    supported.
                  </div>
                }
              >
                <Textarea
                  rows={6}
                  className="mt-1.5"
                  placeholder="..."
                  value={textDescription}
                  onChange={(event) => {
                    setTextDescription(event.target.value);
                  }}
                />
              </FormItem>

              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-600"></div>

              <div>
                <Label>Choose collection</Label>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Choose an exiting collection or create a new one. If you don't
                  have any collection please click here to go to{" "}
                  <span
                    onClick={() => navigate("/createCollection")}
                    className="text-green-500 cursor-pointer"
                  >
                    create a collection
                  </span>
                  .
                </div>
                <RadioGroup value={selected} onChange={setSelected}>
                  <RadioGroup.Label className="sr-only">
                    Server size
                  </RadioGroup.Label>
                  <div className="flex py-2 space-x-4 overflow-auto customScrollBar">
                    {colls.map((plan, index) => (
                      <RadioGroup.Option
                        key={index}
                        value={plan}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                              : ""
                          }
                          ${
                            checked
                              ? "bg-teal-600 text-white"
                              : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          }
                          relative flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-600 px-6 py-5 cursor-pointer flex focus:outline-none `
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <div className="flex items-center justify-between">
                                    <RadioGroup.Description
                                      as="div"
                                      className={"rounded-full w-16"}
                                    >
                                      <NcImage
                                        containerClassName="aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
                                        src={`${config.API_URL}uploads/${
                                          plan?.bannerURL || ""
                                        }`}
                                      />
                                    </RadioGroup.Description>
                                    {checked && (
                                      <div className="flex-shrink-0 text-white">
                                        <CheckIcon className="w-6 h-6" />
                                      </div>
                                    )}
                                  </div>
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-semibold mt-3  ${
                                      checked ? "text-white" : ""
                                    }`}
                                  >
                                    {plan?.name || ""}
                                  </RadioGroup.Label>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              {/* <MySwitch label={"Put on sale"} desc={"Please enter the price and stock amount that shows how many copies of this item you want to sell "} onChange={setSale} /> */}
              {sale === true && (
                <>
                  <FormItem
                    label={`Enter your price($100)`}
                    className="text-sm"
                  >
                    <Input value={price || 0} onChange={onChangePrice} />
                  </FormItem>
                  <FormItem label="Enter your stock amount" className="text-sm">
                    <Input
                      value={stockAmount || 1}
                      onChange={onChangeStockAmount}
                    />
                  </FormItem>
                </>
              )}
              {/* <MySwitch
                label={"Put it on auction"}
                desc={"Please input expiration date amd time of auction"}
                onChange={setAuction}
              /> */}
              {sale === true && auction === true && (
                <FormItem
                  label="Enter your auction end time"
                  className="text-sm"
                >
                  {/* //  <DateTimePicker 
                  //   value={auctionEndTime ||  new Date()}
                  //   onChange={(newValue:any) => {
                  //     handlelChangeAuctionEndTime(newValue);
                  //   }}
                  //   format="dd/MM/yyyy hh:mm a"
                  // />  */}
                  <select
                    className="w-full border rounded-xl"
                    value={period}
                    onChange={(event) => {
                      setPeriod((event as any).target.value);
                    }}
                    placeholder="select auction time"
                  >
                    <option value={0.000694}>1 min</option>
                    <option value={0.00347}>5 min</option>
                    <option value={0.00694}>10 min</option>
                    <option value={7}>7 days</option>
                    <option value={10}>10 days</option>
                    <option value={30}>1 month</option>
                  </select>
                </FormItem>
              )}
              <div>
                {metaData?.length > 0 && (
                  <>
                    <p>Schema Properties</p>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Add Custom Schema, Upload Schema via JSON File or Choose
                      from pre-defined schema templates.
                    </div>
                  </>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {metaData?.length > 0 &&
                    metaData?.map((meta, index) => (
                      <div className="grid grid-cols-3 items-start" key={index}>
                        <div className="col-span-1 text-neutral-500 dark:text-neutral-300">
                          {meta.trait_type} {meta.required ? "*" : ""} :
                        </div>
                        <div className="col-span-2">
                          {meta.type.text === "boolean" ? (
                            <p className="italic text-sm text-neutral-500 dark:text-neutral-400">
                              [true, false]
                            </p>
                          ) : meta.type.text === "textarea" ? (
                            <p className="italic text-sm text-neutral-500 dark:text-neutral-400">
                              "Lorem ipsum dolor sit amet, ..."
                            </p>
                          ) : (
                            <p className="italic text-sm text-neutral-500 dark:text-neutral-400">
                              [{metaData[index].property.join(", ")}]
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                {schemaData?.attributes?.length > 0 && (
                  <>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                      When you create the JSON files, please add the correct
                      fields and values, and keep the order.
                      <br />
                      Please refer to the sample JSON file.
                    </div>
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                      <Label className="w-full sm:col-span-1 md:col-span-2">Default Schema</Label>
                      <Label className="w-full sm:col-span-1 md:col-span-2">File List</Label>
                      <Label className="w-full md:col-span-1">&nbsp;</Label>
                    </div> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                      <Textarea
                        className="w-full min-h-[300px] max-h-[500px] sm:col-span-1 md:col-span-2"
                        value={JSON.stringify(schemaData, undefined, 4)}
                        readOnly
                      ></Textarea>
                      <SchemaList
                        className="w-full min-h-[300px] max-h-[500px] overflow-x-auto sm:col-span-1 md:col-span-2"
                        nftItems={nftItems}
                        jsonItems={jsonItems}
                        setNftItems={setNftItems}
                        setJsonItems={setJsonItems}
                      />
                      <div className="w-full md:col-span-1 flex flex-col">
                        <label
                          htmlFor="json-upload"
                          className="mb-4 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium px-4 py-3 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-70 bg-green-400 hover:bg-green-500 text-neutral-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-0"
                        >
                          Upload
                          <input
                            id="json-upload"
                            name="json-upload"
                            type="file"
                            className="sr-only"
                            accept=".json,application/json"
                            onChange={changeJsonFile}
                            multiple
                          />
                        </label>
                        <ButtonPrimary onClick={handleValidate}>
                          Validate
                        </ButtonPrimary>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col pt-2 space-x-0 space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 ">
                <ButtonPrimary
                  className="flex-1"
                  onClick={() => {
                    createItem();
                  }}
                >
                  Create NFTs
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={working}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PageUploadItem;
