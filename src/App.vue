<script setup lang="ts">
declare module "vue3-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { onMounted } from 'vue';
import pconf from "./assets/particles.json"
import { useKimaiStore } from './stores/kimai'

const particlesInit = async (engine: Engine) => {
  await loadFull(engine);

  console.log(engine);
};

const particlesLoaded = async (container: Container) => {
  console.log(container);
};

const store = useKimaiStore();

console.log(store.users)

onMounted(() => {
  document.body.classList.add('bg-black')
  store.loadUsers()
  store.loadProjects()
  store.loadActivities()
})

document.onkeydown = function (evt) {
  console.log(evt)
}

import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
  { id: 7, name: 'Caroline Schultz' },
  { id: 8, name: 'Mason Heaney' },
  { id: 9, name: 'Claudie Smitham' },
  { id: 10, name: 'Emil Schaefer' },
]

const selected = ref(people[3])

const selectedProject = ref(store.projects[0])
</script>

<template>
  <div>
    <vue-particles id="tsparticles" :options="pconf" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" />

    <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div class="mt-10 sm:mx-auto sm:w-full sm:min-w-[920px] ">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <p>Scan Card</p>

          <Listbox as="div" v-model="selectedProject">
            <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900">Project</ListboxLabel>
            <div class="relative mt-2">
              <ListboxButton
                class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span class="block truncate">{{ selectedProject.name }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption as="template" v-for="project in store.projects" :key="project.id" :value="project"
                    v-slot="{ active, selectedProject }">
                    <li
                      :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                      <span :class="[selectedProject ? 'font-semibold' : 'font-normal', 'block truncate']">{{ project.name
                      }}</span>

                      <span v-if="selectedProject"
                        :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>


          <Listbox as="div" v-model="selected">
            <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900">Activity</ListboxLabel>
            <div class="relative mt-2">
              <ListboxButton
                class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span class="block truncate">{{ selected.name }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption as="template" v-for="activity in store.activities" :key="activity.id" :value="activity"
                    v-slot="{ active, selected }">
                    <li
                      :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ activity.name
                      }}</span>

                      <span v-if="selected"
                        :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>

    </div>
  </div>

</div></template>