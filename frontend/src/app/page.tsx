"use client"
import { useEffect, useState } from "react";
import { contractAbi } from "./abi";
import { GitHubLogoIcon, TwitterLogoIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import Web3 from "web3";
import { Admin } from "./admin";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [courseContract, setCourseContract] = useState(null);
  const [courseFee, setCourseFee] = useState('');
  const contractAddress = '0x95D2d8e7EB936638be0c383f5FDC0b3788A2257D';
  const [email, setEmail] = useState("");
  const [transaction, setTransaction] = useState("");
  const [option, setOption] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const courseInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);
          setCourseContract(courseInstance);

          courseInstance.methods.courseFee().call()
            .then(fee => {
              setCourseFee(web3Instance.utils.fromWei(fee, 'ether'));
            });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      alert('Please install an another Ethereum wallet.');
    }
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!web3 || !courseContract) return;

    const accounts = await web3.eth.getAccounts();
    courseContract.methods.payForCourse(email).send({ from: accounts[0], value: web3.utils.toWei(courseFee, 'ether') })
      .on('transactionHash', (hash: any) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction successful:', receipt);
        setTransaction(receipt.blockHash);
      })
      .on('error', (error: any) => {
        console.error('Error:', error);
      });
    setEmail("")
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center font-bold text-lg tracking-tighter border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          EtherPayChain
        </p>
        <div className="fixed bottom-4 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none gap-x-4">
          <a href="https://github.com/skushagra9/EtherPayChain"><GitHubLogoIcon /></a>
          <a href="https://twitter.com/skushagrasharma"><TwitterLogoIcon /></a>

        </div>
      </div>

      <div className="flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">

        <form className="w-full relative" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center relative">
              <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none">
                <EnvelopeClosedIcon />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@provider.com"
              />
            </div>
            <button type="submit" className="bg-indigo-900 text-white px-4 py-2 rounded-lg mt-2 ">
              Pay &nbsp; {courseFee} eth
            </button>
          </div>
        </form>
        <button
          onClick={() => setOption(!option)}
          className="bg-gray-50 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >Admin Dashboard
        </button>
      </div>
      {option && <Admin web3={web3} courseContract={courseContract} />}
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl tracking-tight font-semibold">
        Seamlessly connect any app to Ethereum&apos;s chain for smooth cryptocurrency payments
        {transaction && <span className="text-green-400">Transaction Successful, Hash - {transaction}</span>
        }
      </div>
    </main>
  );
}
