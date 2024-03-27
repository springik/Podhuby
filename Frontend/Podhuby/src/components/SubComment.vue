<template>
  <!-- subcomm -->
        <div class="flex flex-row justify-center items-center text-center ml-5 lg:ml-20"><!-- root comm -->
            <div class="text-center flex flex-col lg:flex-row justify-center items-center">
                <div class="flex flex-row gap-2">
                    <img class="w-14 h-14 rounded-full" :src="userImage" alt="user">
                <div>
                    <h3 class="underline decoration-wavy lg:decoration-dotted text-base pt-3.5 lg:pb-0.5 pb-2.5">
                        {{ this.username }}
                    </h3>
                    <h4 class="py-1 text-accentColor text-xs">
                        {{ this.useradd }}
                    </h4>
                </div>
                </div>
                <div class="w-11/12 lg:w-1/2 ml-1.5">
                    <p class="text-xs text-left">
                        {{ this.content }}
                    </p>
                </div>
            </div>
        </div>
</template>

<script>

export default {
    name: 'Subcomment',
    props: [ 'username', 'useradd', 'content', 'userImage' ]
}
</script>

<style src="../styles/styles.css" scoped></style>
