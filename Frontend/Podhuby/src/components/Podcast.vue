<template>
    <section>
        <!-- Content section -->
        <section>
            <div class="flex justify-center items-stretch">
                <div class="flex flex-col justify-center items-center lg:w-3/4">
                    <h2 class="my-12 p-4 text-white md:text-6xl text-4xl text-center uppercase outline-dashed outline-4 outline-accentColor podcast-header header-border">
                        {{ this.$route.params.title }}
                    </h2>
                    <p class="p-4 mb-2.5 w-3/4 text-xs md:text-base text-center font-medium text-white podcast-p-shadow">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                    </p>
                </div>
            </div>
        </section>
        <!-- Comment section -->
        <section>

        </section>
    </section>
</template>

<script>
export default {
    mounted() {
        console.log("W");
    }
}
</script>

<style src="../styles/styles.css" scoped></style>