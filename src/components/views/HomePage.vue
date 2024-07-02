<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import HeaderPage from './HeaderPage.vue'
import Loader from '../loader/LoaderComponent.vue'
import { useLoader } from '../composables/useLoader'
import type { IUseLoader, IDataObj } from '../../models/models'
import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { fetchDataAll } from '@/api/service'

const data = ref<IDataObj[]>([])
const lastVisible = ref<QueryDocumentSnapshot | null>(null)
const inputString = ref<string>('')

const { isLoading, showLoader, hideLoader }: IUseLoader = useLoader()

async function getData(isInitialLoad: boolean = true): Promise<void> {
  showLoader()
  try {
    const picturesSnapshot = await fetchDataAll(isInitialLoad, lastVisible, inputString)
    if (picturesSnapshot.docs.length > 0) {
      lastVisible.value = picturesSnapshot.docs[picturesSnapshot.docs.length - 1]
    } else {
      lastVisible.value = null
      window.removeEventListener('scroll', handleScroll)
    }

    const allData: IDataObj[] = []
    picturesSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      allData.push(doc.data() as IDataObj)
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
  data.value.filter((item: IDataObj) =>
    item.userEmail.toLowerCase().includes(inputString.value.toLowerCase())
  )
)

onMounted(async () => {
  await getData(true)
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 250 && !isLoading.value) {
    getData(false)
  }
}

watch(inputString, async (newInputString, oldInputString) => {
  if (newInputString !== oldInputString) {
    await getData(true)
    if (newInputString === '') {
      window.addEventListener('scroll', handleScroll)
    } else {
      window.removeEventListener('scroll', handleScroll)
    }
  }
})
</script>

<template>
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
            <p class="main__item-text user-email"><span>Created by</span> {{ file?.userEmail }}</p>
            <p class="main__item-text date">
              <span>Published </span>{{ new Date(file?.timestamp).toString().slice(0, 24) }}
            </p>
          </div>
          <img class="main__item-img" :src="file.src" alt="" v-if="file.src" />
        </li>
      </ul>
      <div v-if="filteredData.length === 0">No data for this email. Try something different</div>
      <Loader :isLoading="isLoading" />
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
  margin-top: 70px;
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
@media (max-width: 620px) {
  .main {
    margin-top: 120px;
  }
}
</style>
