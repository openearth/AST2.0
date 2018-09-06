<template>
  <div class="project-settings">
    <header>
      <h2>Settings</h2>
      <nav>
        <ul>
          <li><nuxt-link to="/en/settings/project-area">Project area</nuxt-link></li>
        </ul>
      </nav>
    </header>

    <nuxt-child />
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
.project-settings {
  width: 700px;
}

</style>
