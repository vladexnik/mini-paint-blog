<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import HeaderPage from './HeaderPage.vue'
import Loader from '../loader/LoaderComponent.vue'
import { useLoader } from '../composables/useLoader'
import type { IUseLoader, DataObjT2 } from '../../models/models'
import { getDocs, collection, query, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../../firebase/config'

const data = ref<DataObjT2[]>([])
const lastVisible = ref<any>(null)
const inputString = ref('')

const { isLoading, showLoader, hideLoader }: IUseLoader = useLoader()

async function fetchAllData(isInitialLoad = true): Promise<void> {
  showLoader()
  try {
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

    if (picturesSnapshot.docs.length > 0) {
      window.addEventListener('scroll', handleScroll)
      lastVisible.value = picturesSnapshot.docs[picturesSnapshot.docs.length - 1]
    } else {
      lastVisible.value = null
      window.removeEventListener('scroll', handleScroll)
    }
    const allData: DataObjT2[] = []
    picturesSnapshot.forEach((doc) => {
      allData.push(doc.data() as DataObjT2)
    })
    if (isInitialLoad) {
      data.value = allData
    } else {
      data.value = [...data.value, ...allData]
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    hideLoader()
  }
}

const filteredData = computed(() =>
  data.value.filter((item: DataObjT2) =>
    item.userEmail.toLowerCase().includes(inputString.value.toLowerCase())
  )
)

onMounted(async () => {
  await fetchAllData()
})

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchAllData(false)
  }
}

watch(inputString, async (newInputString, oldInputString) => {
  if (newInputString !== oldInputString) {
    lastVisible.value = null
    data.value = []
    await fetchAllData(true)
    window.removeEventListener('scroll', handleScroll)
    if (newInputString === '') {
      window.addEventListener('scroll', handleScroll)
    }
  }
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
        <Loader :isLoading="isLoading" />
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
