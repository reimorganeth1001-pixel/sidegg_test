'use client';

import Image from 'next/image';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
          Disclaimer
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="leading-relaxed">
            This website-hosted user interface (this &quot;Interface&quot;) is a frontend software portal to the 
            Sides.gg protocol, a decentralized and blockchain-enabled smart contract and tools (the &quot;Sides.gg Protocol&quot;).
            This Interface and the Sides.gg Protocol are made available by the Sides.gg Foundation; however, all transactions
            conducted on the protocol are run by related permissionless smart contracts. As the Interface and the Sides.gg Protocol
            and its related smart contracts are accessible by any user, entity, or third party, there are a number of third-party
            web and mobile user interfaces that allow for interaction with the Sides.gg Protocol.
          </p>

          <p className="leading-relaxed">
            THIS INTERFACE AND THE SIDES.GG PROTOCOL ARE PROVIDED &quot;AS IS&quot;, AT YOUR OWN RISK, AND WITHOUT WARRANTIES 
            OF ANY KIND. The Sides.gg Foundation does not provide, own, or control the Sides.gg Protocol or any 
            transactions conducted on the protocol or via related smart contracts. By using or accessing this Interface 
            or the Sides.gg Protocol and related smart contracts, you agree that no developer or entity involved in 
            creating, deploying, or maintaining this Interface or the Sides.gg Protocol will be liable for any claims 
            or damages whatsoever associated with your use, inability to use, or your interaction with other users of, 
            this Interface or the Sides.gg Protocol, including any direct, indirect, incidental, special, exemplary, 
            punitive, or consequential damages, or loss of profits, digital assets, tokens, or anything else of value.
          </p>

          <p className="leading-relaxed">
            The Sides.gg Protocol is not available to residents of Belarus, the Central African Republic, The Democratic 
            Republic of Congo, the Democratic People&apos;s Republic of Korea, the Crimea, Donetsk People&apos;s Republic, and 
            Luhansk People&apos;s Republic regions of Ukraine, Cuba, Iran, Libya, Somalia, Sudan, South Sudan, Syria, the USA, 
            Yemen, Zimbabwe, and any other jurisdiction in which accessing or using the Sides.gg Protocol is prohibited 
            (the &quot;Prohibited Jurisdictions&quot;).
          </p>

          <p className="leading-relaxed">
            By using or accessing this Interface, the Sides.gg Protocol, or related smart contracts, you represent that 
            you are not located in, incorporated or established in, or a citizen or resident of the Prohibited Jurisdictions. 
            You also represent that you are not subject to sanctions or otherwise designated on any list of prohibited or 
            restricted parties or excluded or denied persons, including but not limited to the lists maintained by the 
            United States Department of Treasury&apos;s Office of Foreign Assets Control, the United Nations Security Council, 
            the European Union or its Member States, or any other government authority.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <Image 
            src="/new_sidesgg.svg"
            // src="/Original Logo_Indigo_No_BG.svg"
            alt="sides.gg"
            className="opacity-50"
            width={100} 
            height={48} 
            priority 
          />
        </div>
      </div>
    </div>
  );
}
