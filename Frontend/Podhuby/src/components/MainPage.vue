<template>
  <section class="main-page-content">
    <div class="filter-menu">

    </div>
    <div class="main-grid">
        <Card v-for="n in 24" :key="n" heading="Lorem ipsum" imgPath="/placeholder.svg" :description="lorem" :favouriteCount="n"/>
    </div>
  </section>
</template>

<script>
import Card from "./Card.vue"
export default {
    name: "MainPage",
    components: { Card },
    data() {
        return {
            lorem: "This should be a description!Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla est. Pellentesque ipsum. Etiam posuere lacus quis dolor. Proin pede metus, vulputate nec, fermentum fringilla, vehicula vitae, justo.",
        }
    }
}
</script>

<style>
div.filter-menu {
    position: sticky;
}
div.main-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8rem;
    margin-top: 0.3125rem;
}
section.main-page-content {
    margin-left: auto;
    margin-right: auto;
    width: 70%;
}
div.grid-item {
    padding: 1%;
    background-color: var(--accent-color);
}
</style>