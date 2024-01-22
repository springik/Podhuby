<template>
  <div class = "hover-highlight card-root">
    <div class="card-heading">
        <img :src="imgPath" alt="Podcast icon">
        <h3>{{ heading }}</h3>
    </div>
    <div class="card-description">
        <p>
            {{ description }}
        </p>
    </div>
    <div class="card-reactions">
        <img class="card-heart" :src="iconSource" alt="heart icon" @click="toggleFavourite">
        <span>{{ favCountTmp }}</span>
    </div>
  </div>
</template>

<script>
export default {
    name: "Card",
    props: ['heading', 'imgPath', 'description', 'favouriteCount'],
    data() {
        return {
            iconSource: "/heart.svg",
            favCountTmp: this.favouriteCount
        }
    },
    methods: {
        toggleFavourite() {
            if(this.iconSource === "/heart.svg") {
                this.iconSource = "/heart-fill.svg"
                this.favCountTmp++
            }
            else {
                this.iconSource = "/heart.svg"
                this.favCountTmp--
            }
        }
    }
}
</script>

<style>
div.card-heading {
    margin: 0.625rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
div.card-heading > img {
    border-radius: 25%;
    height: 2.5rem;
    width: 2.5rem;
    background-color: white;
}
div.card-heading > h3 {
    margin: 0.6875rem 0rem 0.625rem 0.3125rem;
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    border-bottom: 2px black dotted;
}
img.card-heart {
    height: 1.5rem;
    width: 1.5rem;
}
div.card-description {
    padding: 0% 5%;
    font-weight: 600;
    text-align: center;
}
div.card-reactions {
    display: flex;
    padding: 0.3125rem;
    justify-content: center;
    align-items: center;
}
div.card-reactions > img {
    padding: 0.625rem 0.9375rem;
}
div.card-reactions > span {
    border-bottom: 2px black dotted;
}
div.card-root {
    border-radius: 0.6875rem;
    box-shadow: 1rem 1rem 0 0.3125rem var(--accent-color);
    background-color: var(--tertiary-color);
}
</style>