<template>
  <div>
    <button v-for="(rating, index) in ratings" :key="index" :class="rating" class="p-1" @click="selectRating(index)" @mouseenter="hoverRating(index)" @mouseleave="leaveRating">
      <img :src="rating" class="w-6 h-6" />
    </button>
  </div>
</template>

<script>
import star from '/star.svg'
import starEmpty from '/star-empty.svg'

export default {
    data() {
    return {
      currRatingsArray: [star, star, star, star, star],
      selectedIndex: -1,
      selectedWithClick: -1

    }
  },
  methods: {
    selectRating(index) {
        this.selectedIndex = index
        if(this.selectedWithClick == index)
            this.selectedWithClick = -1
        else {
            this.selectedWithClick = index
        }
        this.$emit('onRate', ++this.selectedIndex)
    },
    hoverRating(index) {
        this.selectedIndex = index
    },
    leaveRating() {
        this.selectedIndex = this.selectedWithClick
    }
  },
  computed: {
    ratings() {
        const newArray = []
        for (let i = 0; i < this.currRatingsArray.length; i++) {
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