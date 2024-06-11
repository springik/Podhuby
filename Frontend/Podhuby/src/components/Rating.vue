<template>
  <div>
    <button v-for="(rating, index) in ratings"
    :key="index" :class="rating"
    class="p-1" @click="selectRating(index)"
    @mouseenter="hoverRating(index)"
    @mouseleave="leaveRating"
    >
      <img :src="rating" class="w-6 h-6" />
    </button>
  </div>
</template>

<script>
import star from '/star.svg'
import starEmpty from '/star-empty.svg'

export default {
    name: 'Rating',
    emits: ['onRate'],
    props: ['initialSelectedIndex'],
    data() {
    return {
      selectedIndex: this.initialSelectedIndex || -1,
      selectedWithClick: this.initialSelectedIndex || -1

    }
  },
  methods: {
    selectRating(index) {
        if(this.selectedWithClick == index)
            this.selectedWithClick = -1
        else
          this.selectedWithClick = index

        this.$emit('onRate', this.selectedIndex)
    },
    hoverRating(index) {
        this.selectedIndex = index
    },
    leaveRating() {
        this.selectedIndex = this.selectedWithClick
    },
    setRating(index) {
      console.log('setting rating...');
      this.selectedIndex = index
      this.selectedWithClick = index
    }
  },
  computed: {
    ratings() {
        const newArray = []
        for (let i = 0; i < 5; i++) {
            if(i <= this.selectedIndex)
                newArray.push(star)
            else
                newArray.push(starEmpty)
        }
        return newArray
    }
  }
}
</script>

<style src="../styles/styles.css" scoped></style>
<style scoped>
.star {
    width: 1.5rem;
    height: 1.5rem;
}
</style>