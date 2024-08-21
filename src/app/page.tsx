"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  getDoc,
  query,
  doc,
  deleteDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState<any[]>([])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList : any[] = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
    setDisplay(inventoryList)
    setSearch('')
  };

  const removeItem = async (item:any) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item:any) => {
    if (item) {
      handleClose();
      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      await updateInventory();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    setDisplay(
      inventory.filter((item) => item.name.includes(search))
    )
  }, [search, setSearch])
  // console.log(typeof inventory[0], inventory)
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      {/* Table Section */}
      <div className="relative w-2/3  flex flex-col justify-center items-center gap-5 overflow-auto">
        <h1 className="text-5xl font-bold text-center">Storage Management</h1>
        <button
          className="text-xl px-5 py-3 bg-slate-300 text-gray-800 rounded-lg"
          onClick={handleOpen}
        >
          Add new Item
        </button>
        <form className="w-1/2 mx-auto">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Your Inventory"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
              }}
            />
            {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
          </div>
        </form>
        <div className="w-full flex justify-center max-h-[40vh] overflow-auto">
          <table className="w-3/4 table-auto border-separate border border-spacing-2 border-slate-500">
            <thead>
              <tr className="text-center bg-slate-500">
                <th className="border border-slate-600 p-2">Name</th>
                <th className="border border-slate-600 p-2">Quantity</th>
                <th className="border border-slate-600 p-2">Options</th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              {display.map(({ name, quantity }) => (
                <tr className="text-center w-full">
                  <td className="border border-slate-700 p-1 w-1/2">{name}</td>
                  <td className="border border-slate-700 p-1 w-1/4">
                    {quantity}
                  </td>
                  <td className="border border-slate-700 p-1 flex justify-center">
                    <button
                      className="px-5 hover:bg-green-400 rounded-md"
                      onClick={() => addItem(name)}
                    >
                      Add
                    </button>
                    <button
                      className="px-5 hover:bg-red-400 rounded-md"
                      onClick={() => removeItem(name)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal Section */}
      <div
        className={`relative z-10 ${open ? "" : "hidden"}`}
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 flex flex-col w-full">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      What is the item?
                    </h3>
                    <div className="mt-2 ">
                      <input
                        type="text"
                        className="flex w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setItemName(e.target.value);
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => addItem(itemName)}
                >
                  Add Item
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-slate-300 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
