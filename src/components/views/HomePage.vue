<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HeaderPage from './HeaderPage.vue'
import Loader from '../loader/LoaderComponent.vue'
import { useLoader } from '../composables/useLoader'
import type { IUseLoader, DataObjT2 } from '../../models/models'
import { getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/config'

const data = ref<DataObjT2[]>([])
let inputString = ref<string>('')
const { isLoading, showLoader, hideLoader }: IUseLoader = useLoader()

async function fetchAllData(): Promise<void> {
  showLoader()
  try {
    const picturesCollectionRef = collection(db, 'pictures')
    const picturesQuery = query(picturesCollectionRef, orderBy('timestamp', 'desc'))
    const picturesSnapshot = await getDocs(picturesQuery)

    const allData: DataObjT2[] = []
    picturesSnapshot.forEach((doc) => {
      allData.push(doc.data() as DataObjT2)
    })
    console.log(allData)

    data.value = allData
    console.log(data.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    hideLoader()
  }
}

const filteredData = computed(() =>
  data.value.filter((item: any) =>
    item.userEmail.toLowerCase().includes(inputString.value.toLowerCase())
  )
)

onMounted(async () => {
  await fetchAllData()
})
</script>

<template>
  <div>
    <div class="container">
      <HeaderPage />
      <div class="main">
        <h1 class="main__title">Home Page is developing...</h1>
        <input
          type="text"
          class="main__input"
          v-model.trim="inputString"
          name=""
          placeholder="Enter user's email"
        />
        <ul class="main__list" v-if="filteredData">
          <li class="main__item" v-for="file in filteredData" v-bind:key="file.timestamp">
            <div class="main__item-context">
              <p class="main__item-text user-email">
                <span>Created by</span> {{ file?.userEmail }}
              </p>
              <p class="main__item-text date">
                <span>Published </span>{{ new Date(file?.timestamp).toString().slice(0, 24) }}
              </p>
            </div>
            <img class="main__item-img" :src="file.src" alt="" v-if="file.src" />
          </li>
        </ul>
        <div>
          <Loader :isLoading="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main__input {
  border-radius: 25px;
  padding: 10px;
  max-width: 520px;
  width: 100%;
  margin-top: 20px;
  background-color: var(--background-color);
  color: var(--color);
  border: 1px solid var(--color);
}

.main {
  max-width: 750px;
  margin: 0 auto;
  text-align: center;
}

.main__title {
  color: var(--secondary-color);
}
.main__list {
  max-width: 550px;
  margin: 0 auto;
  margin-top: 20px;
}

.main__item {
  display: block;
  margin-bottom: 20px;
}

.main__item-img {
  margin: 0 auto;
  max-width: 550px;
  width: 100%;
  aspect-ratio: 8 / 5;
  border: 1px solid var(--color);
  border-radius: 20px;
}

.main__item-context {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  gap: 25px;
}
</style>
