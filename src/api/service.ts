import { type Ref } from 'vue'
import type { IDataObj } from '@/models/models'
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  addDoc
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { toast } from 'vue3-toastify'
import type { QuerySnapshot } from 'firebase/firestore'

export async function fetchDataAll(
  isInitialLoad: boolean = true,
  lastVisible: Ref<QueryDocumentSnapshot | null>,
  inputString: Ref<string>
): Promise<QuerySnapshot> {
  const picturesCollectionRef = collection(db, 'pictures')
  let picturesQuery
  if (inputString.value.length > 0) {
    picturesQuery = query(picturesCollectionRef, orderBy('timestamp', 'desc'))
  } else if (isInitialLoad || !lastVisible.value) {
    picturesQuery = query(picturesCollectionRef, orderBy('timestamp', 'desc'), limit(10))
  } else {
    picturesQuery = query(
      picturesCollectionRef,
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible.value),
      limit(10)
    )
  }
  const picturesSnapshot = await getDocs(picturesQuery)
  return picturesSnapshot
}

export const saveToDB = async (pictureObj: IDataObj) => {
  try {
    await addDoc(collection(db, 'pictures'), pictureObj)
    toast.success('Picture successfully saved!')
  } catch (e) {
    toast.error('Error! Try again or reload the page!')
  }
}
