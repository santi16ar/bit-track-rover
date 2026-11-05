// bit-Track Rover — versión React Native
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Switch,
  StyleSheet,
} from "react-native";
import Svg, { Path, Polygon, Rect, Circle } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { BleManager, State } from "react-native-ble-plx";
import { encode as b64encode, decode as b64decode } from "base-64";

const IMG1 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCADqAeADASIAAhEBAxEB/8QAGgAAAQUBAAAAAAAAAAAAAAAAAQACAwQFBv/EAEMQAAEDAgQDBQUGBAUEAQUAAAEAAgMEEQUSITFBUXETIjJhkRQzUoGhBiNCYrHBNENykhUkU9HhJUSC8BZUY4Oi8f/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAIREBAQEBAQACAgIDAAAAAAAAAAERAjEDEiFBBBNRkaH/2gAMAwEAAhEDEQA/ANbswl2YT0ltzM7MJdmFIigjDAETsnIHZA+m2CslriNSPRVqbgrL9kUgHDTMombvUjABck7pjLZ3XOiATkMpJDzWU915gANHNWlXPYKcNa4G5WUXf5rKdAGXQLLbRPhYO3jdyKoSU9W9xMU+Zh1B2Vmhhkh97JmJIOpXX6/jXP7fnE3aNZX1l9rBWBFGQDZZcxLq+q/pBWtTHNAwnksz8RfS7FnJHsWclIiE+1MgQAR1GVvFquw3y6lZ0JJrXa/hV+nN2nfdZ6WJkkEVlsVztb/FO6robrna0/5p3VWJTAnXTAnLTJ10rpt0UDrpo2SugNkDkCUkECTSiU0oG/iC6Kj/AIZnRc5+MLpKT+GZ0WasTJJIKKR2WbjPuG9VpHZZeMn7pnVWelQYOP8AMBdGFzuDe/C6EJSHnZNRKaooopqKDmsd1r/kqdF789Fbxo3xB3kFUoveu6LcYaF1rYcP8q1ZC2aEWpWKVYsWCFgikstBYJWCSKAWCVgikgDgAw9FxldrUuXZTG0Tz5FcZVG9Q7qrGeleTc9FdpRaFnRUpTq5X4NI2dFpGukkksqKSCKAIHZFA7IH0ysOaANSVWp1ZfsgDcpNgFBNpFNbTQqw0aKvN4JehRWNATpfVP3q+rE2IWTmG9WP6UFiOENgIHJZdBczkkk97iVtvNon9FiUPvR5lej4vK49+xYeL4jUgfAE6GufFG1mS9kXA/4nPpuwKEA8j6LPEl9Xq4s/4i//AE0RiL/9NV8p5H0T2sN9itfWM/ar9G8yTl5FiQtKHwarMotJtuC0WPaxveNly79dOfE6Si7ZnxBETM+ILm2kXO1v8U7qt/tWfEFz1Y4GpcRtdWJTQU5MajdaQ5JBK6ByAOiCDTooH3QQuldAimlG6aSqAPGF0dN7hnRc0D3gukp3DsGajZZqxNdK6bnHMIZxzCink6LLxk9xnVaJeDxWZjBuI1YlNwUgzLoAuawDWqkXSBKsOKCRQCiiigkg5fFzfEJFBRe8epcUN8Ql6qOi8T1thd4LapNKaPosTgtymFqdnRSrEqSSSy0SKCSApJJII6k2gefIrjZtZ3dV19YbUz+i4+TWY9VqM1BLxWjD4W9FmyfutOPgqjVRCCSyopIJICmnZFA7IDT7/NXFTp/F81cLgOKBKtJtL0U5J4D1Vd+8l+SKyG6BNjfapaOd05wsFXZJfEWs/IUGrK/PC7JYgi11mUtO5kgLiArscZbHlboFmU+b212ZxNjZej4/Ljj37Nar3sEzidwNVXdWR+1siadxfZRRzj2uRj+I3Ksw4FJJWsqe3iDAPDqSuGuhtTPIyYNiaLW4hPhmncdWt9FoPwpzn5hKwf8AiVLHhxZvI0/JNXFaCTvd4AFRvm7d7m32Oy0hRgHxD0ULcNDZ+07X5ZVNMUxGUezK0/ZWjcn0R9lZzKauMsxqjJA4v5BdF7KzmU00MRO7k1MYAhPNHsTzW/7BDzd6o+wQ8neqaY5/sSntgvu6y2ZYKOH3pc0czdRdrhf+qD8ypeo3Pj6vkZppm294oTCRoDcLY7fCh+L6OViFmHze7dG48s2von2hfi6nsc92buSQjcTyXU+xU/8ApD6o+x0/+i30V1nHL9gfiTTAfiC6r2WD/RZ6IimhH8ln9oTTHHmNwftdXIw4MGp9V0vYQ/6TP7QmOpIHbxNHTRNMc+Q7mfVNIfzPqtx2HxHwlw+qhdh1tnAppjIDpGuuCUysmfLlzcFqPont1Db9FSqaYl2oIRDPs/7+RdGFzNHA6GUkEi62Iqh7RZ2oSkXHgm1k7gomyseNDqpLqNCjwQQOxRHK4ib103VNovx9Uq03rJuqze1fHO7I4hbZby3oNIWdFzNLK+QDNqumi923os1Yegigo0KSSSBJJJIK2IG1I9cidZD1XWYmbUjlyP4itRmo3auHVace6zN5Gf1LTYqjTRQSusqKSF0kBQKSRQKDxHqrhGUaBUoPEeqvkXCBgzEm+ygf439FZtYKsfeu6IrHdexuq0TWnEA++trWWo9hYS57QWqKWnhDo5o+JQW2tsNlkQs/6i4H4lre0RtLW3ufJVxSsFYJbnM46Lrx19Zdc+puA6jY+W5GqtNe+I8dBuFYLLPKBb3gVybPhrb72cFaZURv2dYrMmpmvN23aeYTIoKntLEhzOamLrZc0uByvc3zCjLJmublfmH4r8VjPxCanmc1sbnRjTMCrMOMxmwebHk4WRdWjFHHNcRlrnnUjb63CD2tcRkqOzsbXAym/LQKWOtieN7XUhbDKWuNiW7HkgjjfVnMHRNGU2BvfN57oR1zC4skAbIDbKw5/wBNlMYW6ZXEHmD/ALJPMgzOsHADbKoJA5pt3h6ovcWtu1hf5AgfqqwhbIwnK4OPne3ySpopI73lDyNNDa3yKKjmxPsL9pSVDRzIFlRmxChm1dQ5jzBAP0WnJUyxPDRHn5gi31F02VtDPK2OSL7x+3cIPqsXm134+Tiez/rn5jTu1hjkj8nPDh+iisF04wmiG8RJ83lPGGUQ/wC3b8yVj+uvVP5XE/y5yKqqIfdzyNHK+iuR41VNFndnJ5kW/RbIoKQbU0X9qT8PpJBZ0DB/SLH6Kzjqftz6+f4uveWOcbqTsyIfI/7ppxmsOxjH/gr0uBwu1hlew8nd4KlNg9VH4Mko/KbH0KlncdOb8FBuLVt73aRy7NWosYl/mUjnebLrOb7dTOswTxnkAVdhr8Tb44HSjzjIPqFJad/Hz+pP9tGKujl/lzsP5oz+qs7qpDWyv0koqhh5gXCtA3ANiOq7R4e+cvhJpAO4v1TigVWEJgiJvkAPkmupmHYkKdJUxUdTO4EH6JN7aPdpcFaSTUxE2Zp0PdPIp5PdKcQDvY9U3K21v0QxyVUb1Mp/MVmHWd3VddPgsMjnOZLI0nXWxCy5Ps5VNkLo5IpATsbtK1rOG0Q0C6hngb0XPQ08lPII5W5Xiy6EeEKUgpJJKNEigkgKSCSClixtSHquTG5XUYybUq5cbHotRimt1mj6rSYs2P8AiGfNaTFRpXSTborKikgigKSCSBQ+M9VoDZZ0PvCtAO009Sik7ZVnMOYuA0spyQPMrErcQqTXGniYA1ouSTugY6HECXWJLSdrqCJlTTytjmb3HuuPJbVKJQy8xBJ4BUsQrGMnZEW969wbKyam4nhpgDcgAEqDEqp1NVQxtZ3R3rq3TTiUA2IWV9q4rtppASDfLor56nraglMzQ9zbXCksLqphjnexR5hqBZW7qKVkyV0rLOibm5gbp6IKCn28Z7sjTGeRFk19LBIL93X5K6+SENtK5mX82qzKmpwphNpi08oyoqVkMNJG4mSzTrZUZMRlgls6B+Q6tdq24URxejhdmhp3zOGzpCoaj7R1koLWsjY0/NBpw4w3jI9n9QV+HFQ7ZzJP6SuJfVzl+YuHTKLItrde/EOrTZQd+K+J4s9vqFMx9M9+cFuYi1zyXCwYjYdyeRnk/UK7HiEvwxyDmDYpi67VhbazSLeSaaeF0hkdE0vP4rarl48Wy+ISs6aqwzG2D/uLf1NKYa6JsUbTdsbQeYCkXOPxyNoualvyaVLHWvmjD2SktOxsmDduELjmFidtKf5jvVIyPP43eqDbzt5hNMjB+ILELnHcn1QTBtmeMfzB6phqouMjfVY6VjyQapq4fjCaayH4j6LMNm7m3VMM0Q3kYP8AyCDVNbF+Y/JMNdH8DvoswTxE2EjT01TXVUTTlu4nkGkoNM1w4Rn1QNceEY9VkzV0cERkeyfKDbuxEn0CzHfa3Cxs+Z3SMoOnNa/gxo9U01kp2yj5Lk5PtjQt8EE7/kB+6a37WPl9xhkr/Mvt+yDrfapviHommpmP8wrlf/kFaf8AtKePyLy4/RObiGNVH8PTxgcy2w+pQdMZpT/Md6rPOIzulyNjc7W3iJWa04wzK6qqI23d4I2jbqt2knAhuI2NcD4rIHSsLXRyPPduBrwWq1wIFjcLHqpO1Y0F17uUzM0dixxHkqjUugqbKwjSQW8wrLJGyC7SCoJEkEroopJJIMvHDaABc1wK6HHT90B5Ln+BWoxVWaZ0Msbm76q3T4i11g9tuiz60/fRjyKbEO8EHTtraZw0laUJK+kiF5J2NHmVzlKHEEAKPHYP+nh25DgorqGYjSPF21DCPIp7qymaLumYB5lcbhzc0TQy211alpnyxOabklB1LKunebMmY476FB9VC0aPBPK65nBIXh8jXMLTa2YrWfQ3t3kF+CcF5NrA+avSVIDO6Wk8rrnmUkhlLWzWA0sr9NROZq51z5oLgncd1g1mJClxR33Je5xAJ8lvNhPNYWKRiPFY8wBDwEG2Km7dBosPG5JQ+OWIgEaarYEV4wQFQxSkdLRkMYXPBBQT4dJM+kie8DOd7K5XUJxCFkTjaxvfkmYZG5tHHnblNtir75exLTbQ6FCDFTCCJrAb2CbIQwfRSiQPbcKGZudpBGiismrxOaCofEIgLC7XHis2fEaqW95Mo/KFsTwhzSyZudnPiFk1OHSMGeE9tH5bj5KjPe58hu9zndTdNDVJlINiLHkUrKBmVNLVLZNKKgcFG4KZyicgDNipb2AIUTdinnZBZjmkA8R+eqnEjjuG+iqRqdpREpdmFiBbordNjMLYmxNhfdumpCphUqYfeu6oN2TGXNaS2Aac3KhJj2IlgfDRwuafzElRvHcd0KbB7lvRBBL9psRGhbFC788RP7qrJj2MvHcmiI/+20LTe0OFnAEciqcuHU0hvkyHm02RWXJjmLHR1XM3oLKs/Eq6Tx1lQf8A8hWs/DpWD7qoJHJwVR7ZGZi5o7u+ig6j7MStloonzs7TMbEnUm2l9V0JFLwpx6rgsPxSqpiyOIttezWvboCVtOq8WkazsfvCXWcWMsANeao6MSRt8MDAnCoeNmRj/wAVz1Nh/wBoJ7Onq+xby0/2VoYHG9xdWYhUSknwseQEGsauT42t6ABcjVYBBVYnUTuc93aSFwZGLALpIaCip3ZoacF9rZ5HFxT2mQDK0NYEGLTYDHF4II4/N+pVz/D6ZlhNIXH4Rp9Fe7Mu8b3O8th9FIyENHdaG/JBTjghj9xTAebhb9dVLkld4pA0cmD9yrfZWFyQOqaWjg5p+aChUU0bmE5czvicblVMOp3Gc53vc0Xs0m4WrI3um6hpWgSk9UFoQtdlvwUpbbbUJNGgUlrKoh6oWsbtJafJTFoKY5hCIfHVPZo8ZhzCtRzMkHdcqCFhuND5INRJZzJ5Y/zBWY6pj9D3T5qYrNx46AeSwvwrZxxwLhY6WCxvwrUZrPrNalvk1OhHeCZVG9V0apKcd8dUEUdQW+EIVUhmpnsk8JCiYDyTp4yYSoqLCs0LS29+S1nTObC48Vl0cZzrRlZeEhAKGpcZgFsySkNCwKFmWW60pZLiyCpV1VXHWHsCLaHVdAyqJbG/4mgrnnvtUtB42XQQRNc1jbaNQWGykjQLNxWjnqpoJWABzHcTwWsxobsEZBchA6JgEbQd7ISAZbJwQcLoEzYJ1V/DutoQi1uiE4vC8eSChHUOicA+wJ2P4Xf7FXWTtdo7Q+aouaCCCAQdwVCe1h93Z7fgcduhUVrOYHDmqz6azs7NHDW3NVY65gOVzjE74X7euyusqdBmGh4hBEXtBvJCAfiAuoZKSnqdcrSeY0KvtdHJsQg6mY7W2qDFmwbfspCPJyyZ43QyOY61xyOi6007gbte6/mbqrUUTZj99DHIfiHdd6orlHFQuK6OTBKZ2oNRH6OCrOwUg/dzxn+q7SiMRptfQok3GgK1jhNQ3+WHf0kFROons8Ub29WoqnGVYYUewAR7MjZA8KpTe8d1VprXXAAJPkjSYdVOcXGIsB4u0RCf4HdE2Efct6LTjwu4+9kuDwYFcgw+GNoDIb24uN0GI2N0hsxpcfIKwzDpneLKweZ1W2IwBYuAHJqa6WCM28TuW59Ais6PDY/xFzzyGgTajCGSjvgRtGwWkZpnaMiyDm85foNVDKx5ae0kNuTO79d0FbDYKaF7W+zROPF1tT81r9uWt7oZGBxA/dZVLAC+7JpmAcNHel1c9lgJu5hldzldm+m30QE1bJHWY587uUYLvrsm2qX7NihH5jnd6DT6qy1j3AAA24DYKTscusjg3yQVGQWcHSSySkcCbN9ArLIri5+idnhZ4Wlx5lMlqixhc5zY2jjsPVBOIwwXNm+ZVepq4aaJ0jntYxou57tAFiVv2koae4Ehnfyj1+uyzpKmXFZGPnZ2UTCCyO9wTzKC7Nj8k7iKGmdL+eTQHoFUOMYvG+76Rj2flYf2KuQxBtmsAaPMEAKUyti0IzO5A6IJcOxaKu+6e0xTcWO49FdiZkkKzC6Z5DuwJtqDl2VulrQ5+SUZXbXQa0QuGqUtTIRo1T2VRDZAqUtTCEDMgco3Rub0U1kgUFa6RAO4VhzGu8ionRub5hEZOJaWHms/8KvYke/81QOwVRmzm9U5WKQXkCqyG9Q/qrlGO+EVZipPyqSamvFbL9FsNiaOCLo2kbKDDp6WzvD9FadTEt8K0mRAHZSZPJBgspsr/CpTFzaVr9iL7J4hbyCDl66CR8sboYXutobLpKSJwgaXNykjUKUxgWsApbaBA0NRLblOARyopZUst06yVtUBaEyb3buikCo4rKYoIwN3ytb9UERCaQnO3KB3UET42uBDgCORUApuz1gkdF5DVvoVbQQVu3qIx97CJB8UZsfQqWHEY3ENbNld8L9D9U8jRRviY8Wcxrh5i6C82rcPE245hSNqozuCPksc0jG+6fJF/Q6w9ELVbPDMyQcpG2PqEG5mjfs4JGEO4A/JYoqZ2+9pifON1/oU9mIxA2Mj4jyeC1BpmlZ8AHTRD2e2znj5qtHXOd4Khr/mCpxVTW/D/aij7Ofi9WhEU3n/APqE32qby9Ex9UW6vlDfmAgsikIF3PyDmbBRPETL3fmA48FXNUx5sH9ofLVEBpdmyNzcyL2QPE4PuYy7zaLj1Oia4zP8TmMH9x/2TiSdySpWQk76IK3YtPjc+T+o2HoFKxmUWY0AcmiysFkcYu8j5phqY2+FpP0QNETj5Imlz6EkpvtROzGhCSpLW3keGN62CBzKSOE3L8vldP7SNngZm8ysStx6kpGkgPldyaLD1KwpftLXVpLaZsdPHtcC7vUoO1lqixt3yNib1sFmT4xSRgljjKR8O3qVhRYfM9omq6iZ7jrbxFNlo2NIkMr3QnukAWId5oHV32kqiC2AMhHMan6rnqurnndeeV8rj8RvZbmSkj1FK95HEj/dZziKmqIbGI2s1t//ABQHDqbZ78rr6HyXQU7AGhrWk8suiz4G5TcDqAFpQZQwvtIHcCSVRaGYWhhL8zt8x2UM1ZFRVDKanYJ6lxs5x2b/AO8lPE9tPIyAn/MTNLz5BUKeDPj0zraM1HoP90AqsXqaWqbG9zTcXy5bLQhnjxCO1gyUC481lNov8QxCaplH3QdZg8hoE+H7iqIjcDkdw/RB1eEzmanyu95GcrloLGw5wZihy+CaPN81tIAUCLpyCCMtTCFMmkKoi1QzFPLbJhCDMraTt5MwdZUX0Eg2N1tPGqYQiOVlw6aKRzyM7Sb6cFNSMAdodeRXQFoPBQS0UUutsruY0KC6AjlTgEbIGhqcEbI2RQRsjZEBA1P4JWTgNEAATrIgInRQM4pIlBA4LG+0TsraTU27W62gsj7RMLqBsgt91IHHodEEjvEUw7p7/EUwoBwQRQQIoIlBAChZOQVAso5Iw7cXUqBUFN1FC7eNvoozh8fDMPIOKv2RsqM4YdHxzf3FTtoImnRg9FaspbIIIogwmwVloTOJUjBr5qKniZx4qOprWQRucXhjG7vJUNbWx0sDnSOsxu55nkFyc8s2Lzl7yBCw92O+g/580GhPj/aPLaSMv5vft6KMz4lISS/LYXsAAnQU8cAIYA3nc7K2xjsoduwaE3B+iDOnfirY3GKSQkD8JBWHQPqpsXZ7Y6V0gDveX5ea611RGzQDMQdCmGVx17HTh3Tog57FYnOyMa0lzzYW4eavYNhoEjczSA0X1/3VmogZUPEkZyvAtlOxVnDx3nN2IZ58/RBcYWnoTYHmq80YEkgto5gJ6gptNqwwyh5c0m1trXUlRLHG49o9oJbfU20ugya60cRWRSAWLnDV5JBV3E6+mLHNZNGXW0y6qrALMaA67bD5KC7G8Dd2W/qVr0cfaysbcuY3vFY8FzILAdSd1qvmmpcLnngZmmc5rGANuqK9YZqbGW1Mxuxzu6eFuXotIRj2ipczxPAaD1CpRVVVVQ9nXYaezO7wbAedirjqyOmonvLS4MbYC+pOwF0FOtqJGt9hw1hfINJJBtH8+f6KGmo5KXK2QjNvop24tTUkETJIXRveL5I23G6mjlFUQ9rHNB2zboNKg/i6Lo4fKy31h4c29dAPgic71W4gCSXFJAEE5AoGkJjmqQoO2QU3jVMIUrxqmEKsorJzQjZFoQTBqIan2SARTcqWVPSUDbI2RSQCycAgnhAgk5JAopqCKCIcoKqBtTTSQu2e2ylQJVFB2h15JhT5PGVGVAkEUECKCR2SQJBFBAkkkkCSSSCBKTgmJxKKQ8SlzBjb31OyhbqdFlfaKuMFJ2TD95N3BbgOJQZuIVDsTrCyJ9oYzZvn5qxE0Rtbo1uio0bezjAc3vDey0oWucbBzWk6kWv6oJ4XANLhKAGnwlqexr6xxdcRwjcoMY6qlDL2jZq4hQ4453sTBESyIOALRxFtEFqOppWMJpGiWxtn4E9VmQfaZ0k5YYG5bkAgnVOYfZPs8Xgd9wIb1JsFFhmGNhpjLLbM4bngEGu3sMQjLo+7IBfz/wCQsyYz09S2eMXc3uPaeIUNHUZajNC64adPNa9XlzxTgXbINUAZWgtB7EtcRc5jssSrwmqr62WeZzQ0mzSdrcLLVwyobVy1MoZYMk7Ntzw5qSuq4qcEE5n8GDf/AIUHNVmFRUkBILpX+egCYxxsO6LpV9RPVO75sz4Rso43DLbXogvUxBkF3G/kV0kVRDR4cySd4a0k24knyC5imc7NpYBdJDTtq6Snz6iJ5NlRHLJJPTuqJgY4fwRX1ceFz+yqMc6Bkj5WdrGxwa5t/r6rRkIqK9kDfBBq7+rl8v3VWjaKyDEI9s73AH1sfogmkoqStEdSy4OWwIOluVlLFDYgAdFQwWmq6a8cpDojwJ1B8lsvcKeF0lru4DmeCC3hbc09RLwFo2/Ldaap0UXs9KyM+IC7up3VkFA9JNuiEBSSSQBB2ycmu2QVnjVMIUrhqoyFUMsnNCVk5oREySSSikkikgFkUkkCRGyCSAoFFAopqBRKaiFdIpXTC4BFVJhaQqMqSpeL3KhvcAg3CIN0EkLoCkgldAU1FJAkkkkCRCCIVCQebBFRSu71lBKw2aSuTxKX2vG5BfuwjI3rx+q6iSQRwOedmguPyC4yidnzPd4nnNfzRWgwbXJPEgK1HZkfusrudv0VVoJ20BNtuS0KFna1UbXG4Gp+SCHGKg0NDFTMuJJ+9IfLknyP9uwMu3e3Lm6gj9lZlrMOrc0b54XgnZxt+qr0tEaaSRrJmyUsosRfUIJ+w7WOkgPhYO0d+36lZ+JyTYi80dCLQNNpJOBPIeS1qo08UX3k/ZNks3zI5BVZsUw6hHYsJJbpkjbt89kFKHDzR5byFxWs5wdh2v4H6f8AvzWcyrdWuzNiyMG1zclaL22w9/m4D9EFOCKRpe6AOi7Tck6dQFn4q00NO17Dne91i5wut5xbFHmkcGNA3Jsucx6uhqY2RQlz8rrlwGiDJdK+Q3e4lPjdrZNiiL058RZx1UFmFwDwQM3VdPhMrnQyMbbPbM2+1/8A2y5Fj7eJbGHVnZublIBGyo18IhkgpnvnBMriS6+99ym4FDMxsolYWlxve2m6vwVUU7QbgHi0qczxRNu5zWjzKBzYWt7x2/VV4P8AN1mfeCE6fmd/wqs1TJXS9jT5gzZzvJa9NCIomsaLNaNAgsNJUoTG7J4QOCKARCAooIqBJrtk5NdsqIXBNITygqiOycAnIhAUUklAkkUEUkkkkCSSQRBQKSBRQJTCU4pqAFRvUhUZVRSqtIysdtZJTvP4mcWn9lvTMzAhYtZSkE2UFynqoqgdx3e4tO4Uy5p7XxvvctI2IVuDFZI7Nnb2g+IboraSUFPVw1A+6eCfhOhCmRBSSQQG6V0EUUkQgiCqhKvIfvFYVV/vCgZibrYbNzLCFzNI3K1oG1x8l0GLE+wSD8v7rnqc2sPP1UWLkRuRdt9OS2MNZminLSGuLMrTyusaI7beELZpJW0+H1EzgSGDMQN9kFWP7PUcDDJUSueGi7iTlaE0vihDXU0AihJs0nQv87JUTqjF5u3qRlpmHuRjbqeasy5amsktbs6dhaP6uKCGSljrnMqpJWshYy2psBrr+yllwehqCJgHEuAIex+h0VajgbX4IYxbOL5XHgeCp4V/iMEhaG3jJ7zHmwB/ZBrxUjYbNYSRtqnYpKaegGXxavA/T9QrscZdYkWVOoaKqpeDqxndCDAjbPVOD6gukdzcbqy3Dg7cWW0yma0aNClEPkgwxhttgmvoL6Ft10AgPJPbTX4IjkZsKcR3AVA3D66N33THnyXdtpW8QpmQsbs0IrkaSkxWSwdStA5udZa9Pgj3WNTMB+WMfuVuNYnhoAQV6emZTsDYmhoVloRARsgICcAkEUBCcEAiECRSSUCTXbJya5URlBOKCICSKSoKKSSgSCKSAJWRQQJBFJFBApyBQNTU4oIG2TSE+yBCCBzbqGSIOFiFaI0TC1BkVNFe9hcLJno3NJLRcLqixV5aZr+GqI5BzC031BCsw4nVQ2BIkbycNfVa1Rh9+HzWbNQube2qKuQYzTyWEodE7z1Hqr8crJReN7XDyN1y8kDmnUWUWVzDdhLTzabIOwSXMRYpWw/zO0HJ4urkWPi331OQebHINtELNjxqjf4nujP5mqwzEKRwuKmP+5BaVV/vD1TjXUn/ANTF/cFGyRkpLozmbfcbFBBi5tQSnk1czTyXcbnXdbuO1GWlcwEXcQ0Bc00ua8Otog1YjYjS/BbeHhs0E9O/wyMsR9FzsUmgNxbgtegn7OVrr3A36KDRqpY8Mw1zmgAtFmjm7gq+HQ9lhMj3G7nMcSTx01UuLUEle2IxSNyt1yn8XmrkdORSCIiwy2PzVGJ9mpG5JIm7AAhbop+/mA1KbSYfBTvzsZZ1rXU1RUMp4i9x/wCfIKCGrm9nhys1kd3WjzTKeDs42t3PHqo6Rr6iY1MosdmN5BaTIuaojbGpWxqUMsE6yBgjCeGJwCICBoanBqcAnAIG5dEQNE6yNkDbJwCVk6yAIopIEikigSSSKgCaU5NKoYUESkqhJJJICkkkgSSSSBJJJKAJIpIpIFFAoGlBEpIG2QKehZAyyBan2SsgiLUwtU9kC1BXLLqGSna7grhahlQZMtAHDTXqs+bDOTSOi6Qs8kOzBQcfJh727C6qvpnN3aV2rqdrt2qB9Cw8EHFmFMdBddg/C4z+EKu7CIidiEHK9hc6BSxdvTkuikdH/SV0JwiPgSEf8LZax1RHMPBc7M8uc48SU8Qkt0C3zhLL3TvYMo0CDmMro3K1T1Qa4BxIWvLhmf8ADqqr8FlPhbdFXqOvMbbXzs5X2Wg3EYbauc3yLbrDhwGtv3HhnUrSp/s/Lp7TWOcOTGgfVBJPizALRguPDNoPRNp6Gpq5RLU3a3gDv6cFqUuHU9LrFEA743au9SrYYghigaxoAGymDU7LZEBA0BGyeAjZAyycAnWSsgACdZIBFAkkQkgSKARQJJJFAkUElAUkklQk1ycmlAxJIpKoSSSSApJBLggSSSSBJIpIEgigoChZJJFCyFk5BALIEJyRQNslZHgkgFkLJySBtkg3RFHggYWIZVKkghyoZVKkghyIGMKZJBB2Q5IdiOSsIhBVMAPBD2byVwJygpilCkEDRwVhJBD2fkiGKREqiMNRAThskgFkLJyRQABGySSBJIpBAkUkkCSSRQJJJJAkUkuCBJIJICigigCBRKaUDUkTsgiEkkdkuCD/2Q=="; // rover con cruz roja

/* 
  paleta (modo oscuro por defecto)
*/
const PALETTE = {
  dark: {
    bg: "#0b0f19", gradTop: "#0d1424", card: "#141b2d", text: "#ffffff", muted: "#94a3b8",
    border: "rgba(255,255,255,0.07)", divider: "rgba(255,255,255,0.08)",
    inputBg: "#1e293b", inputBorder: "#334155",
    accent: "#00b4d8", accentText: "#38bdf8", primary: "#0066ff",
    headerBg: "rgba(11,15,25,0.9)", barBg: "rgba(11,15,25,0.97)", barBorder: "rgba(255,255,255,0.08)",
    tabInactive: "#8a93a8", tabActive: "#00d4ff", track: "rgba(255,255,255,0.08)",
    itemText: "#cfe3ea", logoutBorder: "rgba(255,255,255,0.14)", logoutText: "#94a3b8",
    switchOff: "#334155", switchOn: "#00b4d8",
  },
  light: {
    bg: "#f5f7fb", gradTop: "#eef4ff", card: "#ffffff", text: "#0f172a", muted: "#64748b",
    border: "#e2e8f0", divider: "#e2e8f0",
    inputBg: "#f5f7fb", inputBorder: "#e2e8f0",
    accent: "#00b4d8", accentText: "#0066ff", primary: "#0066ff",
    headerBg: "rgba(255,255,255,0.92)", barBg: "rgba(255,255,255,0.97)", barBorder: "rgba(0,0,0,0.08)",
    tabInactive: "#94a3b8", tabActive: "#0066ff", track: "#e2e8f0",
    itemText: "#334155", logoutBorder: "#e2e8f0", logoutText: "#64748b",
    switchOff: "#cbd5e1", switchOn: "#0066ff",
  },
};

const GRADIENT = ["#0066ff", "#00b4d8"];
const GRADIENT_DANGER = ["#e11d48", "#be123c"];

/* 
   configuracion bluetooth (BLE)
   
   por defecto el esp32 usa el "Nordic UART Service"
     RX: la app ESCRIBE comandos al rover
     TX: el rover NOTIFICA a la app
*/
const BLE = {
  SERVICE: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
  RX: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
  TX: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E",
  SCAN_TIMEOUT_MS: 15000,
  CONNECT_TIMEOUT_MS: 10000,
};
const CMD = { ON: "ON", OFF: "OFF", CALL: "CALL" };

async function pedirPermisosBluetooth() {
  if (Platform.OS !== "android") return true;
  const P = PermissionsAndroid.PERMISSIONS;
  if (Platform.Version >= 31) {
    const r = await PermissionsAndroid.requestMultiple([P.BLUETOOTH_SCAN, P.BLUETOOTH_CONNECT]);
    return Object.values(r).every((v) => v === PermissionsAndroid.RESULTS.GRANTED);
  }
  const r = await PermissionsAndroid.request(P.ACCESS_FINE_LOCATION);
  return r === PermissionsAndroid.RESULTS.GRANTED;
}

async function asegurarBluetooth(manager) {
  const permisos = await pedirPermisosBluetooth();
  if (!permisos) {
    Alert.alert(
      "Permisos necesarios",
      "Necesitamos permiso de Bluetooth para conectar tu rover. Habilitalo desde los ajustes del teléfono."
    );
    return false;
  }

  let estado = await manager.state();
  if (estado === State.Unknown || estado === State.Resetting) {
    estado = await new Promise((resolve) => {
      const timer = setTimeout(() => { sub.remove(); resolve(estado); }, 3000);
      const sub = manager.onStateChange((s) => {
        if (s !== State.Unknown && s !== State.Resetting) {
          clearTimeout(timer);
          sub.remove();
          resolve(s);
        }
      }, true);
    });
  }

  if (estado === State.Unsupported) {
    Alert.alert("Bluetooth no disponible", "Este dispositivo no es compatible con Bluetooth LE.");
    return false;
  }
  if (estado === State.Unauthorized) {
    Alert.alert("Permisos necesarios", "Habilitá el permiso de Bluetooth para esta app desde los ajustes del teléfono.");
    return false;
  }
  if (estado !== State.PoweredOn) {
    if (Platform.OS === "android") {
      try {
        await manager.enable();
        return true;
      } catch (e) {
        /* el usuario rechazó activarlo */
      }
    }
    Alert.alert("Bluetooth apagado", "Activá el Bluetooth del teléfono para conectar tu rover.");
    return false;
  }
  return true;
}

/*
   HOOK: conexión Bluetooth con el rover
   vive en el nivel de la app para que la conexión se mantenga
   al cambiar de pestaña (Home / Mi rover / Perfil).
   */
function useRoverBluetooth() {
  const managerRef = useRef(null);
  const deviceRef = useRef(null);
  const subsRef = useRef([]);
  const bufferRef = useRef("");
  const scanTimerRef = useRef(null);

  const [power, setPower] = useState("apagado"); // apagado | conectando | encendido
  const [estadoRover, setEstadoRover] = useState("activo"); // activo | viaje | llego
  const [bateria, setBateria] = useState(null); // null = sin datos del rover
  const [llamando, setLlamando] = useState(false);
  const [actividad, setActividad] = useState([]);
  const [dispositivo, setDispositivo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const [dispositivos, setDispositivos] = useState([]);

  const getManager = () => {
    if (!managerRef.current) managerRef.current = new BleManager();
    return managerRef.current;
  };

  const agregarActividad = useCallback((texto) => {
    const ahora = new Date();
    const hora = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, "0")}`;
    setActividad((prev) => [{ id: `${Date.now()}-${Math.random()}`, texto, hora }, ...prev].slice(0, 30));
  }, []);

  const limpiarSuscripciones = () => {
    subsRef.current.forEach((s) => {
      try { s.remove(); } catch (e) { /* noop */ }
    });
    subsRef.current = [];
    bufferRef.current = "";
  };

  const resetEstado = () => {
    deviceRef.current = null;
    setPower("apagado");
    setEstadoRover("activo");
    setBateria(null);
    setLlamando(false);
    setDispositivo(null);
  };

  const escribir = (comando) =>
    deviceRef.current.writeCharacteristicWithResponseForService(
      BLE.SERVICE,
      BLE.RX,
      b64encode(comando + "\n")
    );

  /* mensajes que llegan del rover  */
  const procesarLinea = (linea) => {
    if (linea.startsWith("BAT:")) {
      const n = parseInt(linea.slice(4), 10);
      if (!Number.isNaN(n)) setBateria(Math.max(0, Math.min(100, n)));
    } else if (linea.startsWith("STATE:")) {
      const s = linea.slice(6).trim().toUpperCase();
      if (s === "TRAVEL") {
        setEstadoRover("viaje");
      } else if (s === "ARRIVED") {
        setEstadoRover("llego");
        setLlamando(false);
        agregarActividad("Rover llegó");
      } else if (s === "IDLE") {
        setEstadoRover("activo");
        setLlamando(false);
      }
    }
  };

  const recibir = (valorBase64) => {
    bufferRef.current += b64decode(valorBase64);
    const lineas = bufferRef.current.split("\n");
    bufferRef.current = lineas.pop();
    lineas.map((l) => l.trim()).filter(Boolean).forEach(procesarLinea);
  };

  /*  escaneo  */
  const detenerEscaneo = () => {
    clearTimeout(scanTimerRef.current);
    try { getManager().stopDeviceScan(); } catch (e) { /* noop */ }
    setEscaneando(false);
  };

  const iniciarEscaneo = () => {
    const manager = getManager();
    setDispositivos([]);
    setEscaneando(true);
    manager.startDeviceScan(null, { allowDuplicates: false }, (error, dev) => {
      if (error) {
        detenerEscaneo();
        Alert.alert("Error de Bluetooth", error.message);
        return;
      }
      const nombre = dev && (dev.name || dev.localName);
      if (!nombre) return;
      setDispositivos((prev) =>
        prev.some((d) => d.id === dev.id)
          ? prev
          : [...prev, { id: dev.id, nombre, rssi: dev.rssi ?? -100 }].sort((a, b) => b.rssi - a.rssi)
      );
    });
    clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(detenerEscaneo, BLE.SCAN_TIMEOUT_MS);
  };

  const abrirBusqueda = async () => {
    const ok = await asegurarBluetooth(getManager());
    if (!ok) return;
    setModalVisible(true);
    iniciarEscaneo();
  };

  const cerrarBusqueda = () => {
    detenerEscaneo();
    setModalVisible(false);
  };

  /*  botón "Encender": pide al usuario conectar por Bluetooth  */
  const pedirConexion = () => {
    Alert.alert(
      "Conectar con el rover",
      "Para encender el rover tenés que conectarlo por Bluetooth. Acercate al rover y verificá que tenga alimentación.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Conectar", onPress: abrirBusqueda },
      ]
    );
  };

  /*  conexión al dispositivo elegido  */
  const seleccionarDispositivo = async (item) => {
    detenerEscaneo();
    setModalVisible(false);
    setPower("conectando");
    const manager = getManager();
    try {
      let dev = await manager.connectToDevice(item.id, { timeout: BLE.CONNECT_TIMEOUT_MS });
      dev = await dev.discoverAllServicesAndCharacteristics();
      deviceRef.current = dev;

      subsRef.current.push(
        dev.onDisconnected(() => {
          limpiarSuscripciones();
          resetEstado();
          agregarActividad("Conexión perdida");
          Alert.alert("Conexión perdida", "Se perdió la conexión Bluetooth con el rover.");
        })
      );
      subsRef.current.push(
        dev.monitorCharacteristicForService(BLE.SERVICE, BLE.TX, (error, ch) => {
          if (error || !ch || !ch.value) return;
          recibir(ch.value);
        })
      );

      await escribir(CMD.ON);
      setDispositivo({ id: item.id, nombre: item.nombre });
      setPower("encendido");
      agregarActividad("Rover encendido");
    } catch (e) {
      limpiarSuscripciones();
      try { await manager.cancelDeviceConnection(item.id); } catch (err) { /* noop */ }
      resetEstado();
      Alert.alert(
        "No se pudo conectar",
        "No pudimos conectar con el rover. Verificá que esté encendido, cerca y que no esté conectado a otro dispositivo."
      );
    }
  };

  /*  apagar  */
  const apagar = async (silencioso = false) => {
    const dev = deviceRef.current;
    if (!dev) {
      resetEstado();
      return;
    }
    try { await escribir(CMD.OFF); } catch (e) { /* noop */ }
    limpiarSuscripciones();
    try { await getManager().cancelDeviceConnection(dev.id); } catch (e) { /* noop */ }
    resetEstado();
    if (!silencioso) agregarActividad("Rover apagado");
  };

  /*  llamar al rover  */
  const llamar = async () => {
    if (power !== "encendido" || llamando || !deviceRef.current) return;
    try {
      await escribir(CMD.CALL);
      setLlamando(true);
      agregarActividad("Rover llamado");
    } catch (e) {
      Alert.alert("No se pudo enviar la orden", "Revisá la conexión Bluetooth con el rover e intentá de nuevo.");
    }
  };

  /* cierre de sesión, apaga, desconecta y limpia el historial */
  const desconectarTodo = async () => {
    await apagar(true);
    setActividad([]);
  };

  /*  limpieza al desmontar la app  */
  useEffect(() => {
    return () => {
      clearTimeout(scanTimerRef.current);
      limpiarSuscripciones();
      const m = managerRef.current;
      if (m) {
        try { m.stopDeviceScan(); } catch (e) { /* noop */ }
        if (deviceRef.current) m.cancelDeviceConnection(deviceRef.current.id).catch(() => {});
        m.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    power, estadoRover, bateria, llamando, actividad, dispositivo,
    modalVisible, escaneando, dispositivos,
    pedirConexion, apagar, llamar, desconectarTodo,
    seleccionarDispositivo, iniciarEscaneo, cerrarBusqueda,
  };
}

// componentes base
function Reveal({ variant = "up", delay = 0, style, children }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      delay: delay * 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);

  const [dx, dy] =
    variant === "left" ? [-40, 0] : variant === "right" ? [40, 0] : variant === "anim" ? [0, 40] : [0, 30];
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [dx, 0] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateX }, { translateY }] }]}>
      {children}
    </Animated.View>
  );
}

function LogoIcon({ size = 34 }) {
  return (
    <Svg width={size} height={size} viewBox="10 0 90 100" fill="none">
      {/* anillo exterior con apertura */}
      <Path d="M 56.9 19.7 L 52.5 19.1 L 48.2 19.1 L 43.8 19.6 L 39.6 20.7 L 35.5 22.3 L 31.7 24.5 L 28.3 27.2 L 25.2 30.3 L 22.5 33.7 L 20.3 37.5 L 18.7 41.6 L 17.6 45.8 L 17.1 50.2 L 17.1 54.5 L 17.7 58.9 L 18.9 63.1 L 20.6 67.1 L 22.9 70.8 L 25.6 74.3 L 28.8 77.3 L 32.3 79.9 L 36.2 82.0 L 40.2 83.5 L 44.5 84.5 L 48.8 85.0 L 53.2 84.8 L 57.5 84.1 L 61.7 82.8 L 65.7 81.0 L 69.4 78.7 L 72.8 75.9 L 75.7 72.7 L 78.2 69.1 L 80.2 65.2 L 81.7 61.1 L 82.6 56.8 L 83.0 52.5 L 82.8 48.1 L 82.0 43.8 L 80.6 39.6" stroke="#FFB030" strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* anillo interior con apertura */}
      <Path d="M 54.8 29.5 L 51.8 29.1 L 48.7 29.0 L 45.7 29.4 L 42.7 30.2 L 39.9 31.3 L 37.3 32.8 L 34.9 34.7 L 32.7 36.9 L 30.8 39.3 L 29.3 41.9 L 28.2 44.7 L 27.4 47.7 L 27.0 50.7 L 27.1 53.8 L 27.5 56.8 L 28.3 59.7 L 29.5 62.5 L 31.1 65.1 L 33.0 67.5 L 35.2 69.6 L 37.7 71.4 L 40.4 72.9 L 43.2 74.0 L 46.2 74.7 L 49.2 75.0 L 52.2 74.9 L 55.3 74.4 L 58.2 73.5 L 60.9 72.2 L 63.5 70.6 L 65.9 68.7 L 67.9 66.4 L 69.7 63.9 L 71.1 61.2 L 72.1 58.3 L 72.8 55.4 L 73.0 52.3 L 72.8 49.3 L 72.3 46.3 L 71.3 43.4" stroke="#FFB030" strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* cuerpo de la flecha */}
      <Path d="M 30.7 75.0 L 73.14 23.32" stroke="#FFB030" strokeWidth={5.5} strokeLinecap="round" />
      {/* punta de la flecha */}
      <Polygon points="86,8 79.82,25.01 70.32,17.04" fill="#FFB030" />
    </Svg>
  );
}

function GradientButton({ title, onPress, disabled, colors = GRADIENT, style, textStyle, loading, height = 52, radius = 14 }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          borderRadius: radius,
          opacity: disabled ? 0.6 : 1,
          shadowColor: colors[0],
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height, borderRadius: radius, alignItems: "center", justifyContent: "center", flexDirection: "row", paddingHorizontal: 20 }}
      >
        {loading && <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />}
        <Text style={[{ color: "#fff", fontWeight: "600", fontSize: 16 }, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function FloatingInput({ label, value, onChangeText, theme, secureTextEntry, keyboardType }) {
  const c = PALETTE[theme];
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;
  const anim = useRef(new Animated.Value(floated ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: floated ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [floated, anim]);

  const top = anim.interpolate({ inputRange: [0, 1], outputRange: [15, -9] });
  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [18, 14] });
  const fontSize = anim.interpolate({ inputRange: [0, 1], outputRange: [15, 12] });
  const color = anim.interpolate({ inputRange: [0, 1], outputRange: [c.muted, c.primary] });

  return (
    <View style={{ height: 52, marginVertical: 14 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          height: 52,
          backgroundColor: c.inputBg,
          borderWidth: 1.5,
          borderColor: focused ? c.primary : c.inputBorder,
          borderRadius: 14,
          paddingHorizontal: 18,
          fontSize: 16,
          color: c.text,
        }}
      />
      <Animated.Text
        pointerEvents="none"
        style={{
          position: "absolute", top, left, fontSize, color,
          backgroundColor: floated ? c.card : "transparent",
          paddingHorizontal: floated ? 4 : 0,
          fontWeight: floated ? "600" : "400",
        }}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

function BatteryBar({ value, styles }) {
  const a = useRef(new Animated.Value(value ?? 0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: value ?? 0, duration: 800, useNativeDriver: false }).start();
  }, [value, a]);
  const width = a.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  return (
    <View style={styles.barraContainer}>
      <Animated.View style={{ height: "100%", width }}>
        <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.barraFill} />
      </Animated.View>
    </View>
  );
}

function Screen({ theme, header, bottomBar, centered, children }) {
  const insets = useSafeAreaInsets();
  const c = PALETTE[theme];
  return (
    <LinearGradient colors={[c.gradTop, c.bg]} style={{ flex: 1, paddingTop: insets.top }}>
      {header}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingBottom: (bottomBar ? 100 : 24) + insets.bottom,
          justifyContent: centered ? "center" : "flex-start",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </LinearGradient>
  );
}

function AppHeader({ theme, styles, onPressLogo }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoRow} onPress={onPressLogo} activeOpacity={0.8}>
        <LogoIcon />
        <Text style={styles.logoText}>Bit-track rover</Text>
      </TouchableOpacity>
    </View>
  );
}

// codigo de la app principal
const USUARIOS_LOCALES = [
  {
    email: "demo@bittrack.com",
    password: "demo123",
    nombre: "Usuario Demo",
    hospital: "Hospital Italiano",
    ciudad: "Buenos Aires",
    robot_codigo: "ROB-002",
    robot_modelo: "Rover02",
  },
];

export default function BitTrackRoverApp() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [page, setPage] = useState("welcome"); // welcome | login | home | datos | mirover
  const [theme, setTheme] = useState("dark");
  const [usuario, setUsuario] = useState(null);
  const [loginError, setLoginError] = useState("");
  const rover = useRoverBluetooth();
  const c = PALETTE[theme];

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const goTo = (p) => setPage(p);

  const handleLogin = (email, password) => {
    setLoginError("");
    if (!email || !password) {
      setLoginError("Completá email y contraseña.");
      return;
    }
    const found = USUARIOS_LOCALES.find((u) => u.email === email.trim() && u.password === password);
    if (!found) {
      setLoginError("Email o contraseña incorrectos.");
      return;
    }
    setUsuario({
      nombre: found.nombre,
      email: found.email,
      hospital: found.hospital,
      ciudad: found.ciudad,
      robot_codigo: found.robot_codigo,
      robot_modelo: found.robot_modelo,
    });
    goTo("home");
  };

  const handleLogout = async () => {
    await rover.desconectarTodo();
    setUsuario(null);
    goTo("welcome");
  };

  const logged = page === "home" || page === "datos" || page === "mirover";

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={c.bg} />

      {page === "welcome" && <WelcomePage theme={theme} goTo={goTo} />}
      {page === "login" && <LoginPage theme={theme} onLogin={handleLogin} loginError={loginError} goTo={goTo} />}

      {logged && usuario && (
        <>
          {page === "home" && <HomePage usuario={usuario} theme={theme} goTo={goTo} />}
          {page === "datos" && (
            <DatosPage usuario={usuario} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
          )}
          {page === "mirover" && <RoverPage usuario={usuario} theme={theme} rover={rover} />}
          <BottomBar theme={theme} page={page} goTo={goTo} />
        </>
      )}

      {logged && !usuario && <GuardPage theme={theme} goTo={goTo} />}
    </View>
  );
}

// bienvenida
function WelcomePage({ theme, goTo }) {
  const styles = useStyles(theme);
  return (
    <Screen
      theme={theme}
      centered
      header={<AppHeader theme={theme} styles={styles} onPressLogo={() => {}} />}
    >
      <Reveal variant="anim" style={styles.welcomeCard}>
        <LogoIcon size={72} />
        <Text style={styles.welcomeTitle}>Bit-Track Rover</Text>
        <Text style={styles.welcomeText}>Automatizá el transporte interno sin errores.</Text>
        <GradientButton title="Iniciar sesión" onPress={() => goTo("login")} style={{ alignSelf: "stretch" }} />
      </Reveal>
    </Screen>
  );
}

// iniciar session
function LoginPage({ theme, onLogin, loginError, goTo }) {
  const styles = useStyles(theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onLogin(email, password);
      setSubmitting(false);
    }, 250);
  };

  return (
    <Screen
      theme={theme}
      centered
      header={<AppHeader theme={theme} styles={styles} onPressLogo={() => goTo("welcome")} />}
    >
      <Reveal variant="up" style={styles.loginCard}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <LogoIcon size={46} />
        </View>
        <Text style={styles.loginTitle}>INICIAR SESIÓN</Text>
        {!!loginError && <Text style={styles.formError}>{loginError}</Text>}
        <FloatingInput label="escribe tu email" value={email} onChangeText={setEmail} theme={theme} keyboardType="email-address" />
        <FloatingInput label="escribe tu contraseña" value={password} onChangeText={setPassword} theme={theme} secureTextEntry />
        <GradientButton
          title={submitting ? "ingresando..." : "Iniciar sesión"}
          onPress={submit}
          disabled={submitting}
          style={{ marginTop: 14 }}
        />
        <Text style={styles.demoText}>demo: demo@bittrack.com / demo123</Text>
      </Reveal>
    </Screen>
  );
}

// home
function HomePage({ usuario, theme, goTo }) {
  const styles = useStyles(theme);
  return (
    <Screen theme={theme} bottomBar>
      <Reveal variant="left">
        <Text style={styles.tituloHero}>
          Bienvenido, <Text style={styles.acento}>{usuario.nombre}</Text>
        </Text>
        <Text style={styles.subHero}>Nos alegra volver a verte</Text>

        <View style={styles.contenido}>
          <Text style={styles.contenidoH3}>¿Que necesitas?</Text>
          <Text style={styles.contenidoP}>
            Desde el menú podés consultar tu <Text style={styles.roverTag}>ROVER</Text> y actualizar tus datos.
          </Text>
          <Text style={[styles.contenidoH3, { marginTop: 18 }]}>
            Tu rover asignado:{" "}
            <Text style={{ color: "#71c55b" }}>{usuario.robot_codigo || "sin asignar"}</Text>
          </Text>
          <Text style={styles.contenidoH2}>TOCA ACA PARA LLAMAR A TU ROVER</Text>
          <GradientButton
            title="Llamar al Rover"
            onPress={() => goTo("mirover")}
            height={46}
            radius={50}
            style={{ alignSelf: "flex-start" }}
            textStyle={{ fontSize: 15 }}
          />
        </View>
      </Reveal>

      <Reveal variant="right" delay={0.15} style={{ marginTop: 24 }}>
        <Image source={{ uri: IMG1 }} style={styles.homeImg} resizeMode="cover" />
      </Reveal>
    </Screen>
  );
}

// perfil (datos personales)
function DatosPage({ usuario, theme, toggleTheme, onLogout }) {
  const styles = useStyles(theme);
  const c = PALETTE[theme];

  const Dato = ({ label, valor, last }) => (
    <View style={[styles.dato, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.datoLabel}>{label}</Text>
      <Text style={styles.datoValor}>{valor}</Text>
    </View>
  );
  const CardTitle = ({ children }) => (
    <View style={styles.cardTitleRow}>
      <View style={styles.cardDot} />
      <Text style={styles.cardTitle}>{children}</Text>
    </View>
  );

  return (
    <Screen theme={theme} bottomBar>
      <Reveal variant="anim">
        <Text style={styles.bienvenido}>
          Bienvenido, <Text style={styles.acento}>{usuario.nombre}</Text>
        </Text>
      </Reveal>
      <Reveal variant="anim" delay={0.1}>
        <Text style={styles.subtitulo}>Panel de tu institución</Text>
      </Reveal>

      <Reveal variant="left" delay={0.1} style={styles.card}>
        <CardTitle>Datos del usuario</CardTitle>
        <Dato label="Nombre completo" valor={usuario.nombre} />
        <Dato label="Email" valor={usuario.email} />
        <Dato label="Rover asignado" valor={usuario.robot_codigo || "sin asignar"} last />
      </Reveal>

      <Reveal variant="left" delay={0.25} style={styles.card}>
        <CardTitle>Datos institucionales</CardTitle>
        <Dato label="Hospital o clínica" valor={usuario.hospital} />
        <Dato label="Ciudad" valor={usuario.ciudad} />
        <Dato label="Código del rover" valor={usuario.robot_codigo || "—"} last />
      </Reveal>

      <Reveal variant="left" delay={0.35} style={styles.card}>
        <CardTitle>Apariencia</CardTitle>
        <View style={[styles.dato, { borderBottomWidth: 0 }]}>
          <Text style={styles.datoLabel}>Tema</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.datoValor}>{theme === "dark" ? "Modo oscuro" : "Modo claro"}</Text>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: c.switchOff, true: c.switchOn }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
        <Text style={styles.nota}>Cambiá entre modo oscuro y claro desde tu perfil.</Text>
      </Reveal>

      <View style={{ alignItems: "center", marginTop: 12 }}>
        <TouchableOpacity style={styles.btnLogout} onPress={onLogout} activeOpacity={0.8}>
          <Text style={styles.btnLogoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

// seccion mi rover
function RoverPage({ usuario, theme, rover }) {
  const styles = useStyles(theme);
  const { power, estadoRover, bateria, llamando, actividad, dispositivo } = rover;

  const encendido = power === "encendido";
  const conectando = power === "conectando";

  // estado derivado de la conexión y de lo que informa el rover
  let estado;
  if (power === "apagado") {
    estado = { icono: "⚪", valor: "Apagado", desc: "Encendé el rover para conectarlo por Bluetooth." };
  } else if (conectando) {
    estado = { icono: "🟡", valor: "Conectando", desc: "Estableciendo la conexión Bluetooth con el rover..." };
  } else if (estadoRover === "viaje") {
    estado = { icono: "🟡", valor: "En viaje", desc: "El rover está en camino." };
  } else if (estadoRover === "llego") {
    estado = { icono: "🟢", valor: "Rover llegó", desc: "El rover llegó a destino." };
  } else if (llamando) {
    estado = { icono: "🟡", valor: "Orden enviada", desc: "Esperando respuesta del rover..." };
  } else {
    estado = { icono: "🟢", valor: "Activo", desc: "El rover está en espera y listo para recibir una orden." };
  }

  const bateriaBaja = bateria !== null && bateria < 30;
  const textoBateria =
    bateria === null ? "Sin datos del rover" : bateriaBaja ? "⚠ Batería baja" : "● Nivel normal";

  return (
    <>
      <Screen theme={theme} bottomBar>
        <Text style={styles.pageTitle}>Panel de control</Text>
        <Text style={styles.roverNombre}>{usuario.robot_codigo || "Sin rover"}</Text>
        <Text style={styles.roverSubtitulo}>
          {usuario.robot_modelo
            ? `Modelo: ${usuario.robot_modelo} — Hospital: ${usuario.hospital}`
            : "Sin rover asignado"}
        </Text>

        {/* Encender / apagar */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Encendido</Text>
          <Text style={styles.powerDesc}>
            {encendido
              ? `Conectado por Bluetooth a ${dispositivo ? dispositivo.nombre : "el rover"}.`
              : conectando
              ? "Conectando con el rover..."
              : "El rover está apagado. Al encenderlo vas a conectarlo por Bluetooth."}
          </Text>
          <GradientButton
            title={encendido ? "⏻  Apagar rover" : conectando ? "Conectando..." : "⏻  Encender rover"}
            colors={encendido ? GRADIENT_DANGER : GRADIENT}
            loading={conectando}
            disabled={conectando}
            onPress={() => (encendido ? rover.apagar() : rover.pedirConexion())}
            radius={14}
            height={50}
          />
        </View>

        {/* Estado actual */}
        <View style={[styles.card, { alignItems: "flex-start" }]}>
          <View style={styles.estadoIcono}>
            <Text style={{ fontSize: 30 }}>{estado.icono}</Text>
          </View>
          <Text style={[styles.cardLabel, { marginTop: 18 }]}>Estado actual</Text>
          <Text style={styles.estadoValor}>{estado.valor}</Text>
          <Text style={styles.estadoDesc}>{estado.desc}</Text>
        </View>

        {/* Batería */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Batería</Text>
          <Text style={styles.bateriaNumero}>
            {bateria === null ? "--" : bateria}
            <Text style={styles.bateriaPct}>%</Text>
          </Text>
          <BatteryBar value={bateria} styles={styles} />
          <Text style={[styles.bateriaEstado, bateriaBaja && { color: "#e05c4a" }]}>{textoBateria}</Text>
        </View>

        {/* Llamar al rover */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Llamar al rover</Text>
          <GradientButton
            title={llamando ? "Procesando..." : "Llamar al Rover"}
            onPress={rover.llamar}
            disabled={!encendido || llamando}
            height={50}
          />
          {!encendido && <Text style={styles.nota}>Encendé el rover para poder llamarlo.</Text>}
          {actividad.length > 0 && (
            <View style={styles.actividadLista}>
              {actividad.map((a) => (
                <View style={styles.actividadItem} key={a.id}>
                  <View style={styles.actividadDot} />
                  <Text style={styles.actividadTexto}>{a.texto}</Text>
                  <Text style={styles.actividadHora}>{a.hora}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Hardware */}
        <View style={[styles.card, styles.cardHardware]}>
          {[
            ["Microcontrolador", "ESP32", "Dual-core 240MHz"],
            ["Sensor principal", "Infrarrojo", "Seguimiento de línea"],
            ["Conectividad", "Bluetooth LE", "BLE 4.2 integrado"],
            ["Autonomía", "12 horas", "Por carga completa"],
          ].map(([label, valor, sub]) => (
            <View style={styles.hwItem} key={label}>
              <Text style={styles.hwLabel}>{label}</Text>
              <Text style={styles.hwValor}>{valor}</Text>
              <Text style={styles.hwSub}>{sub}</Text>
            </View>
          ))}
        </View>

        {/* Imagen del rover */}
        <View style={[styles.card, { padding: 0, overflow: "hidden" }]}>
          <Image source={{ uri: IMG1 }} style={styles.roverImg} resizeMode="cover" />
        </View>
      </Screen>

      <DeviceModal theme={theme} rover={rover} />
    </>
  );
}

/*  selector de dispositivos Bluetooth  */
function DeviceModal({ theme, rover }) {
  const styles = useStyles(theme);
  const insets = useSafeAreaInsets();
  const { modalVisible, escaneando, dispositivos } = rover;

  return (
    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={rover.cerrarBusqueda}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { paddingBottom: 20 + insets.bottom }]}>
          <Text style={styles.modalTitle}>Conectá tu rover</Text>
          <Text style={styles.modalSub}>Seleccioná tu rover de la lista de dispositivos Bluetooth cercanos.</Text>

          {escaneando && (
            <View style={styles.scanRow}>
              <ActivityIndicator color={PALETTE[theme].accent} />
              <Text style={styles.scanText}>Buscando dispositivos...</Text>
            </View>
          )}

          <FlatList
            data={dispositivos}
            keyExtractor={(d) => d.id}
            style={{ maxHeight: 280 }}
            ListEmptyComponent={
              !escaneando ? (
                <Text style={styles.emptyText}>
                  No encontramos dispositivos. Verificá que el rover esté encendido y cerca.
                </Text>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.deviceRow} onPress={() => rover.seleccionarDispositivo(item)} activeOpacity={0.8}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceName}>{item.nombre}</Text>
                  <Text style={styles.deviceSub}>Señal: {item.rssi} dBm</Text>
                </View>
                <Text style={styles.deviceCta}>Conectar ›</Text>
              </TouchableOpacity>
            )}
          />

          <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnGhost]} onPress={rover.cerrarBusqueda} activeOpacity={0.8}>
              <Text style={styles.modalBtnGhostText}>Cancelar</Text>
            </TouchableOpacity>
            <GradientButton
              title="Buscar de nuevo"
              onPress={rover.iniciarEscaneo}
              disabled={escaneando}
              height={46}
              radius={14}
              style={{ flex: 1 }}
              textStyle={{ fontSize: 15 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// guard (sin session)
function GuardPage({ theme, goTo }) {
  const styles = useStyles(theme);
  return (
    <Screen theme={theme} centered>
      <View style={{ alignItems: "center", gap: 16 }}>
        <Text style={styles.guardText}>Necesitás iniciar sesión para ver esta página.</Text>
        <GradientButton title="Iniciar sesión" onPress={() => goTo("login")} radius={30} height={46} />
      </View>
    </Screen>
  );
}

// iconos y la barra superior
function IconHome({ size = 26, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 3.2 1.6 10c-.6.4-.4 1.3.3 1.3h20.2c.7 0 .9-.9.3-1.3L12 3.2Z" />
      <Rect x="4" y="12.5" width="16" height="8.7" rx="1.5" />
    </Svg>
  );
}

function IconRover({ size = 26, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x="4" y="5.5" width="16" height="9.5" rx="1.2" opacity={0.75} />
      <Circle cx="7.6" cy="15.8" r="3" />
      <Circle cx="16.4" cy="15.8" r="3" />
    </Svg>
  );
}

function IconUser({ size = 26, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="12" cy="7.8" r="5.2" opacity={0.9} />
      <Path d="M3.5 21.5C3.5 16.8 7.2 14 12 14s8.5 2.8 8.5 7.5H3.5Z" />
    </Svg>
  );
}

function BottomBar({ theme, page, goTo }) {
  const styles = useStyles(theme);
  const c = PALETTE[theme];
  const insets = useSafeAreaInsets();
  const tabs = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "mirover", label: "Mi rover", Icon: IconRover },
    { id: "datos", label: "Perfil", Icon: IconUser },
  ];

  return (
    <View style={[styles.bar, { paddingBottom: 10 + insets.bottom }]}>
      {tabs.map(({ id, label, Icon }) => {
        const active = page === id;
        const color = active ? c.tabActive : c.tabInactive;
        return (
          <TouchableOpacity key={id} style={styles.tab} onPress={() => goTo(id)} activeOpacity={0.7}>
            <View style={{ opacity: active ? 1 : 0.7, transform: [{ translateY: active ? -2 : 0 }] }}>
              <Icon size={26} color={color} />
            </View>
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// estilos
const useStyles = (theme) => useMemo(() => makeStyles(theme), [theme]);

const makeStyles = (theme) => {
  const c = PALETTE[theme];
  const cardShadow = {
    shadowColor: theme === "dark" ? "#000" : "#0f172a",
    shadowOpacity: theme === "dark" ? 0.35 : 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  };

  return StyleSheet.create({
    /* header (welcome / login) */
    header: {
      paddingHorizontal: 20, paddingVertical: 14, backgroundColor: c.headerBg,
      borderBottomWidth: 1, borderBottomColor: c.border, flexDirection: "row", alignItems: "center",
    },
    logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    logoText: { fontSize: 20, fontWeight: "700", color: c.text },

    /* welcome */
    welcomeCard: {
      alignItems: "center", backgroundColor: c.card, borderRadius: 28, padding: 32,
      borderWidth: 1, borderColor: c.border, width: "100%", maxWidth: 420, alignSelf: "center", ...cardShadow,
    },
    welcomeTitle: { fontSize: 29, fontWeight: "800", color: c.text, marginTop: 18, marginBottom: 10, letterSpacing: -0.5 },
    welcomeText: { color: c.muted, fontSize: 16, lineHeight: 24, textAlign: "center", marginBottom: 28 },

    /* login */
    loginCard: {
      backgroundColor: c.card, borderRadius: 28, padding: 28, borderWidth: 1, borderColor: c.border,
      width: "100%", maxWidth: 440, alignSelf: "center", ...cardShadow,
    },
    loginTitle: { fontSize: 25, fontWeight: "800", color: c.text, textAlign: "center", marginBottom: 8, letterSpacing: -0.5 },
    formError: { color: "#e74c3c", fontSize: 14, marginVertical: 8, textAlign: "center" },
    demoText: { fontSize: 12.5, color: c.muted, opacity: 0.8, textAlign: "center", marginTop: 14 },

    /* home */
    tituloHero: { fontSize: 32, fontWeight: "800", color: c.text, letterSpacing: -1, lineHeight: 38, marginBottom: 6 },
    acento: { color: c.accentText },
    subHero: { fontSize: 19, fontWeight: "600", color: c.muted, marginBottom: 22 },
    contenido: {
      backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 28, padding: 24, ...cardShadow,
    },
    contenidoH3: { fontSize: 16.5, fontWeight: "700", color: c.text },
    contenidoH2: { fontSize: 17.5, fontWeight: "700", color: c.text, marginTop: 24, marginBottom: 12 },
    contenidoP: { color: c.muted, lineHeight: 26, fontSize: 15, marginTop: 8 },
    roverTag: { color: c.accent, fontWeight: "700" },
    homeImg: { width: "100%", height: 210, borderRadius: 28, borderWidth: 1, borderColor: c.border },

    /* cards compartidas (perfil + rover) */
    card: {
      backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 28,
      padding: 22, marginBottom: 16, ...cardShadow,
    },
    cardLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: c.muted, marginBottom: 12 },
    nota: { fontSize: 13, color: c.muted, opacity: 0.8, marginTop: 10 },

    /* perfil */
    bienvenido: { fontSize: 30, fontWeight: "800", color: c.text, letterSpacing: -1, marginBottom: 6 },
    subtitulo: { fontSize: 16, color: c.muted, marginBottom: 28 },
    cardTitleRow: {
      flexDirection: "row", alignItems: "center", paddingBottom: 16, marginBottom: 6,
      borderBottomWidth: 1, borderBottomColor: c.divider,
    },
    cardDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: c.accent, marginRight: 10 },
    cardTitle: { fontSize: 19, fontWeight: "700", color: c.text },
    dato: {
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: c.divider, gap: 10,
    },
    datoLabel: { fontSize: 14.5, color: c.muted },
    datoValor: { fontSize: 15, fontWeight: "600", color: c.text, textAlign: "right", flexShrink: 1 },
    btnLogout: {
      paddingVertical: 11, paddingHorizontal: 28, borderRadius: 30, borderWidth: 1.5,
      borderColor: c.logoutBorder, backgroundColor: theme === "light" ? "#fff" : "transparent",
    },
    btnLogoutText: { color: c.logoutText, fontWeight: "600", fontSize: 15 },

    /* mi rover */
    pageTitle: { fontSize: 12, textTransform: "uppercase", letterSpacing: 3, color: c.accent, marginBottom: 8 },
    roverNombre: { fontSize: 32, fontWeight: "800", letterSpacing: -1, color: c.accentText },
    roverSubtitulo: { color: c.muted, fontSize: 14.5, marginBottom: 26, marginTop: 4 },
    powerDesc: { color: c.muted, fontSize: 13.5, lineHeight: 20, marginBottom: 16 },
    estadoIcono: {
      width: 74, height: 74, borderRadius: 37, backgroundColor: "rgba(0,102,255,0.12)",
      borderWidth: 2, borderColor: c.primary, alignItems: "center", justifyContent: "center",
    },
    estadoValor: { fontSize: 27, fontWeight: "800", color: theme === "dark" ? c.accent : c.primary, marginBottom: 4 },
    estadoDesc: { color: c.muted, fontSize: 13, lineHeight: 20 },
    bateriaNumero: { fontSize: 43, fontWeight: "800", color: c.text, marginBottom: 14 },
    bateriaPct: { fontSize: 17, color: c.muted, fontWeight: "600" },
    barraContainer: { backgroundColor: c.track, borderRadius: 999, height: 8, overflow: "hidden" },
    barraFill: { flex: 1, borderRadius: 999 },
    bateriaEstado: { fontSize: 12, color: c.accent, marginTop: 8 },
    actividadLista: { marginTop: 16, gap: 10 },
    actividadItem: { flexDirection: "row", alignItems: "center", gap: 10 },
    actividadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent },
    actividadTexto: { flex: 1, color: c.itemText, fontSize: 13 },
    actividadHora: { color: c.muted, fontSize: 12 },
    cardHardware: { flexDirection: "row", flexWrap: "wrap", paddingVertical: 24 },
    hwItem: { width: "50%", paddingVertical: 10, paddingRight: 8 },
    hwLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: c.muted, marginBottom: 6 },
    hwValor: { fontSize: 15, color: c.text, fontWeight: "700" },
    hwSub: { fontSize: 11.5, color: c.muted, marginTop: 2 },
    roverImg: { width: "100%", aspectRatio: 480 / 234, minHeight: 180 },

    /* modal bluetooth */
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
    modalSheet: {
      backgroundColor: c.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24,
      borderWidth: 1, borderColor: c.border,
    },
    modalTitle: { fontSize: 21, fontWeight: "800", color: c.text, marginBottom: 6 },
    modalSub: { fontSize: 14, color: c.muted, lineHeight: 20, marginBottom: 16 },
    scanRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
    scanText: { color: c.muted, fontSize: 14 },
    emptyText: { color: c.muted, fontSize: 14, lineHeight: 20, paddingVertical: 12 },
    deviceRow: {
      flexDirection: "row", alignItems: "center", paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: c.divider,
    },
    deviceName: { fontSize: 16, fontWeight: "600", color: c.text },
    deviceSub: { fontSize: 12.5, color: c.muted, marginTop: 2 },
    deviceCta: { color: c.accent, fontWeight: "700", fontSize: 14 },
    modalBtn: { height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
    modalBtnGhost: { borderWidth: 1.5, borderColor: c.logoutBorder },
    modalBtnGhostText: { color: c.muted, fontWeight: "600", fontSize: 15 },

    /* guard */
    guardText: { color: c.text, fontSize: 16, textAlign: "center" },

    /* barra inferior */
    bar: {
      position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row",
      alignItems: "stretch", justifyContent: "space-around", backgroundColor: c.barBg,
      borderTopWidth: 1, borderTopColor: c.barBorder, paddingTop: 6, paddingHorizontal: 8,
      shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -6 }, elevation: 12,
    },
    tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3, paddingVertical: 8, borderRadius: 14 },
    tabLabel: { fontSize: 11.5, fontWeight: "600" },
  });
};
